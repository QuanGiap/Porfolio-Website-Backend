import express from "express";
import verifyToken from "../../handler/verifyToken";
import prisma from "../../tools/PrismaSingleton";
import { checkValidInput } from "../../tools/SchemaTool";
import { user_id_schema, user_name_schema, website_id_schema } from "./schema";
import { createErrRes } from "../../tools/ResTool";
const portfolio_data_route = express.Router();
portfolio_data_route.post("/", verifyToken, (req, res) => {
  //create new content
  res.send("post content is not implemented");
});
portfolio_data_route.get("/", async (req, res) => {
  const { website_id, user_name, user_id } = req.query;
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
  const portfolio_data = await prisma.portfolioData.findMany({
    where: {
      website_design_id: web_id,
      user_id: user.id,
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
  //change this later after apply storage 
  // const originWindowUrl = process.env.UNIVERSAL_DOMAIN;
  // const imgsRes = portfolio_data.portfolioImage.map((img) => {
  //   const { image_id } = img;
  //   return {
  //     img_url: `${originWindowUrl}/images/${image_id}.jpg`,
  //     ...img,
  //   };
  // });

  return res.json({
    portfolio_data:portfolio_data
  });
});
export default portfolio_data_route;
