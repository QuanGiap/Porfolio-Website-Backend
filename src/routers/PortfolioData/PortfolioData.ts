import express from "express";
import verifyToken from "../../handler/verifyToken";
import prisma from "../../tools/PrismaSingleton";
import { checkValidInput } from "../../tools/SchemaTool";
import {
  patch_content_schema,
  post_content_schema,
  post_img_schema,
  post_portData_schema,
  user_id_schema,
  user_name_schema,
  website_id_schema,
} from "./schema";
import { createErrRes } from "../../tools/ResTool";
import {
  uploadManager,
  checkValidImgMiddleware,
  checkValidJsonMiddleware,
} from "../../handler/UploadManager";
import { FileArray, UploadedFile } from "express-fileupload";
import { uploadImgToStorage } from "../../tools/GoogleStorage";
import { UserType } from "../../type/Type";
import achievement_route from "./Achieviement/Achieviement";
import experience_route from "./Experience/Experience";
import project_route from "./Project/Project";
import checkOwner from "../../tools/IsOwner";
import { DataType } from "../../Enum/Enum";
import UserInputFilter from "../../tools/UserInputFilter";
const portfolio_data_route = express.Router();

/**
 * Create new portoflioData
 */
portfolio_data_route.post("/", verifyToken, async (req, res) => {
  const { parsed_data, err_message } = checkValidInput(
    [post_portData_schema],
    [req.body]
  );
  if (err_message.error) {
    return createErrRes({ ...err_message, res });
  }
  const user_input = parsed_data[0];
  //req.user exist becuase of verifyToken
  const user = req.user as UserType;
  //check if user already create portData of based on website_id
  const portDataCount = await prisma.portfolioData.count({
    where: {
      user_id: user.id,
      website_design_id: user_input.website_id,
    },
  });
  if (portDataCount != 0) {
    return createErrRes({
      error: "User already have this type of porfolio website",
      res,
    });
  }
  const result = await prisma.portfolioData.create({
    data:{
      website_design_id:user_input.website_id,
      title:user_input.title,
      desciption:user_input.description,
      user_id:user.id,
    }
  })
  return res.json({message:'Created portfolio data success',
    data:result,
  }).status(201);
});

/**
 * Create new portfolio content base on content and portfolio_data_id
 */
portfolio_data_route.post("/content", verifyToken, async (req, res) => {
  //check valid input
  const { err_message, parsed_data } = checkValidInput(
    [post_content_schema],
    [req.body || {}]
  );
  if (err_message.error) {
    return createErrRes({ ...err_message, res });
  }
  //verify user (req.user exist from verifyToken)
  const user = req.user as UserType;
  const user_input = parsed_data[0];
  //check if portfolioData exist base on id
  const portData = await prisma.portfolioData.findFirst({
    where: { id: user_input.portfolio_data_id },
    select: { user_id: true },
  });
  if (!portData) {
    return createErrRes({ error: "portfolioData not found", res });
  }
  if (portData.user_id !== user.id) {
    return createErrRes({ error: "Forbidden", res, status_code: 403 });
  }
  const result = await prisma.portfolioContent.create({
    data: {
      portfolioData_id: user_input.portfolio_data_id,
      content: user_input.content,
      place_id: user_input.place_id,
    },
  });
  //create new content
  res.json({message:'Create content success',data:result}).status(201);
});

/**
 * Update new portfolio content base on content_id
 */
portfolio_data_route.patch("/content", verifyToken, async (req, res) => {
  //check valid input
  const { err_message, parsed_data } = checkValidInput(
    [patch_content_schema],
    [req.body || {}]
  );
  if (err_message.error) {
    return createErrRes({ ...err_message, res });
  }
  //verify user (req.user exist from verifyToken)
  const user = req.user as UserType;
  const user_input = parsed_data[0];
  //check if portfolioData exist base on id
  const port_content_check_result = await checkOwner(
    DataType.PORTFOLIO_CONTENT,
    user_input.id,
    user.id
  );
  if (!port_content_check_result.exist) {
    return createErrRes({ error: "Portfolio content not found", res });
  }
  if (!port_content_check_result.owned) {
    return createErrRes({ error: "Forbidden", res, status_code: 403 });
  }
  const update_data = UserInputFilter(user_input,['id']);
  //update new content
  const result = await prisma.portfolioContent.update({
    where:{
      id:user_input.id,
    },
    data: update_data,
  });
  res.json(result).status(201);
});

/**
 * Get user portfoliodata content including project, achievement, exprience
 */
portfolio_data_route.get("/website_id/:website_id", async (req, res) => {
  const { user_name, user_id } = req.query;
  const website_id = req.params.website_id;
  if (!user_name && !user_id) {
    const err_msg = "Need user_name or user_id in query url";
    return createErrRes({ error: err_msg, res });
  }
  const user_name_parsed = (user_name as string).replace("+", " ");
  //user can get info by user name or user id
  let user_schema_check = user_id ? user_id_schema : user_name_schema;
  let input_check = user_id || user_name_parsed;
  const { err_message, parsed_data } = checkValidInput(
    [website_id_schema, user_schema_check],
    [website_id, input_check]
  );
  if (err_message.error) {
    return createErrRes({ ...err_message, res });
  }
  const [web_id, input] = parsed_data;
  const whereQuery: { [key: string]: string } = {};
  whereQuery[user_id ? "id" : "user_name"] = input;
  //check if user existl
  const user = await prisma.user.findFirst({
    where: whereQuery,
    select: { id: true },
  });
  if (!user) {
    return createErrRes({ error: "User not found", status_code: 404, res });
  }
  const portfolio_data = await prisma.portfolioData.findFirst({
    where: {
      website_design_id: web_id,
      user_id: user.id,
    },
    select: {
      title: true,
      desciption: true,
      project: true,
      portfolio_content: true,
      portfolio_image: true,
      achievement: true,
      experience: true,
      create_at: true,
      last_update: true,
    },
  });
  if (!portfolio_data) {
    return createErrRes({
      error: "Portfolio Data not found",
      res,
      status_code: 404,
    });
  }
  //google storage url
  const imgsRes = portfolio_data.portfolio_image.map((img) => {
    const { image_id } = img;
    return {
      img_url: `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${image_id}.jpg`,
      ...img,
    };
  });

  return res.json({
    portfolio_data: {
      ...portfolio_data,
      portfolio_image: imgsRes,
    },
  });
});

portfolio_data_route.use("/achievement", achievement_route);
portfolio_data_route.use("/experience", experience_route);
portfolio_data_route.use("/project", project_route);

export default portfolio_data_route;
