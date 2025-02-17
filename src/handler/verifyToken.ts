import { NextFunction, Request, Response } from "express";
import { createErrRes } from "../tools/ResTool";
import jwt from "jsonwebtoken";
import { UserType } from "../type/Type";
import dotenv from "dotenv";
import prisma from "../tools/PrismaSingleton";

//extend custom paylod for request
declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

dotenv.config();
//verify user before modify the data
async function verifyToken(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return createErrRes({ res, error: "No token found", status_code: 403 });
  }
  const secret_key = process.env.AUTH_SECRET_KEY_TOKEN;
  if (!secret_key) throw new Error("No secret_key found in verify token");
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secret_key, async (err, data) => {
    if (err) {
      return createErrRes({ res, error: "Invalid token" });
    }
    //check user exist
    req.user = data as UserType;
    const user_count = await prisma.user.count({
      where: {
        id: req.user?.id,
      },
    });
    if (user_count !== 0) {
      next();
    } else {
      createErrRes({ res, error: "User not found", status_code: 404 });
    }
  });
}

export default verifyToken;
