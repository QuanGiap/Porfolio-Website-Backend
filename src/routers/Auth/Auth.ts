import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkValidInput } from "../../tools/SchemaTool";
import { post_sign_up_schema,post_sign_in_schema } from "./schema";
import { createErrRes } from "../../tools/ResTool";
import prisma from "../../tools/PrismaSingleton";
dotenv.config();
const auth_route = express.Router();

/**
 * Authenticating user with password and user name
 */
auth_route.post("/sign_in", async (req, res) => {
    const {err_message,parsed_data} = checkValidInput([post_sign_in_schema],[req.body]);
    if(err_message.error){
        return createErrRes({...err_message,res});
    }
    const {email,password} = parsed_data[0];
    //check if user provide information is valid
    const user = await prisma.user.findFirst({
        where:{
            email,
        },
        select:{
            password:true,
            user_name:true,
            id:true,
        }
    })
    if(!user){
        return createErrRes({error:'Email not found',res,status_code:404});
    }
    const is_correct = await bcrypt.compare(password,user.password);
    if(!is_correct){
        return createErrRes({error:'Password not correct',res,status_code:401})
    }
    const key = process.env.SECRET_KEY_TOKEN;
    if(!key) throw new Error('No secret key found for creating token')
    //create jwt
    const token = jwt.sign({user_id:user.id,user_name:user.user_name},key,{expiresIn:'10h'});
  res.json({message:'Sign in success',authenticate_token:token});
});

auth_route.post("/sign_up", async (req, res) => {
  const { err_message, parsed_data } = checkValidInput(
    [post_sign_up_schema],
    [req.body]
  );
  if (err_message.error) {
    return createErrRes({ ...err_message, res });
  }
  const user_input = parsed_data[0];
  //check if user name exist
  const userNameCountPromise = prisma.user.count({
    where: {
      user_name: user_input.user_name,
    },
  });
  //check if phonenumber exist
  const phoneNumberCountPromise = prisma.user.count({
    where: {
      phone_number: user_input.phone_number,
    },
  });
  //check if email exist
  const emailCountPromise = prisma.user.count({
    where: {
      email: user_input.email,
    },
  });
  const [userExist, phoneExist, emailExist] = await Promise.all([
    userNameCountPromise,
    phoneNumberCountPromise,
    emailCountPromise,
  ]);
  const errorsExist = [];
  if (userExist != 0) {
    errorsExist.push("User name used");
  }
  if (phoneExist != 0) {
    errorsExist.push("Phone number used");
  }
  if (emailExist != 0) {
    errorsExist.push("Email used");
  }
  if (errorsExist.length != 0) {
    return createErrRes({
      error: errorsExist[0],
      errors: errorsExist,
      res,
      status_code: 409,
    });
  }

  //hash password
  const salt = Number(process.env.SALT);
  if (!salt) throw new Error("SALT not found in env");
  const hashPass = await bcrypt.hash(
    user_input.password,
    Number(process.env.SALT)
  );
  const {
    first_name,
    last_name,
    user_name,
    phone_number,
    area_phone_number,
    email,
  } = user_input;
  //create user data
  const user = await prisma.user.create({
    data: {
      first_name,
      last_name,
      user_name,
      phone_number,
      area_phone_number,
      email,
      password: hashPass,
    },
    select:{id:true},
  });
  //return user data except hash password
  return res.status(201).json({
    message:'User created, please veriy email and phonenumber',
    user_id: user.id,
  });
});

auth_route.post("/reset_pass", (req, res) => {
  res.send("reset_pass not implemented");
});

auth_route.post("/confirm", (req, res) => {
  res.send("confirm not implemented");
});

auth_route.post("/refresh_token", (req, res) => {
  res.send("refresh_token not implemented");
});

export default auth_route;
