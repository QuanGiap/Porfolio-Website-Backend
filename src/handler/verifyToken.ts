import { NextFunction, Request, Response } from "express";
import { createErrRes } from "../tools/ResTool";
import jwt from "jsonwebtoken";
import { UserType } from "../type/Type";
import dotenv from 'dotenv';

//extend custom paylod for request
declare global {
    namespace Express {
        interface Request {
            user?: UserType
        }
    }
}

dotenv.config();
//verify user before modify the data
async function verifyToken(req:Request,res:Response,next:NextFunction){
    if(!req.headers.authorization){
        return createErrRes({res,error:'No token found',status_code:403});
    }
    const secret_key = process.env.AUTH_SECRET_KEY_TOKEN;
    if(!secret_key) throw new Error('No secret_key found in verify token')
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token,secret_key,(err,data)=>{
        if(err){
            return createErrRes({res,error:'Invalid token'});
        }
        req.user = data as UserType;
        next();
    })
}

export default verifyToken;