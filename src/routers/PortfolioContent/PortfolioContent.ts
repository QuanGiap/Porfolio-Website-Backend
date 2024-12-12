import express from "express";
import verifyToken from "../../handler/verifyToken";
import prisma from "../../tools/PrismaSingleton";
import { checkValidInput } from "../../tools/SchemaTool";
import { user_id_schema, user_name_schema, website_id_schema } from "./schema";
import { createErrRes } from "../../tools/ResTool";
const portfolio_content_route = express.Router();
portfolio_content_route.post("/", verifyToken, (req, res) => {
  //create new content
  res.send("post content is not implemented");
});
portfolio_content_route.get("/", async (req, res) => {
  const { website_id, user_name, user_id } = req.query;
  if (!user_name && !user_id) {
    const err_msg = "Need user_name or user_id in query url";
    return createErrRes({ error: err_msg, res });
  }
  //user can get info by user name or user id
  let user_schema_check = user_id ? user_id_schema : user_id_schema;
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
      id: true,
      project:true,
      achievement:true,
      portfolio_content:true,
      experience:true,
      portfolioImage:true,
    },
  });
  if (!portfolio_data) {
    return createErrRes({
      error: "Portfolio Data not found",
      res,
      status_code: 404,
    });
  }
  const imgsRes = portfolio_data.portfolioImage.map((img) => {
    const { image_id } = img;
    return {
      img_url: `${window.origin}/images/${image_id}.jpg`,
      ...img,
    };
  });

  return res.json({
    contents:portfolio_data.portfolio_content,
    projects:portfolio_data.project,
    achievemens:portfolio_data.achievement,
    imgs: imgsRes,
    experiences: portfolio_data.experience,
  });
});
export default portfolio_content_route;
