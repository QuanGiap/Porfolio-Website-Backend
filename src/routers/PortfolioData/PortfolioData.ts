import express from "express";
import verifyToken from "../../handler/verifyToken";
import prisma from "../../tools/PrismaSingleton";
import { checkValidInput } from "../../tools/SchemaTool";
import { user_id_schema, user_name_schema, website_id_schema } from "./schema";
import { createErrRes } from "../../tools/ResTool";
import { imgUploadMiddleware, uploadImgToStorage } from "../../tools/ImageManager";
import { FileArray, UploadedFile } from "express-fileupload";
const portfolio_data_route = express.Router();
portfolio_data_route.post("/", verifyToken, (req, res) => {
  //create new content
  res.send("post content is not implemented");
});
portfolio_data_route.post("/image/:place_id", verifyToken,...imgUploadMiddleware, (req, res) => {
  //guarantee files not empty since checked
  req.files = req.files as FileArray
  if(Array.isArray(req.files.images)){
    return createErrRes({res,error:'Only accept 1 image',status_code:413})
  }
  //guarantee 1 image file since checked
  const file = req.files.images as UploadedFile;
  const id = await uploadImgToStorage(file)
  // prisma.portfolioImage.create({
  //   data:{
  //     id:
  //   }
  // })
  //create new content
  res.send("post content is not implemented");
});
portfolio_data_route.get("/website_id/:website_id", async (req, res) => {
  const { user_name, user_id } = req.query;
  const website_id = req.params.website_id;
  if (!user_name && !user_id) {
    const err_msg = "Need user_name or user_id in query url";
    return createErrRes({ error: err_msg, res });
  }
  //user can get info by user name or user id
  let user_schema_check = user_id ? user_id_schema : user_name_schema;
  let input_check = user_id || user_name;
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
    select:{
      title:true,
      desciption:true,
      project:true,
      portfolio_content:true,
      portfolio_image:true,
      achievement:true,
      experience:true,
      create_at:true,
      last_update:true,
    }
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
    portfolio_data:{
      ...portfolio_data,
      portfolio_image:imgsRes,
    }
  });
});
export default portfolio_data_route;
