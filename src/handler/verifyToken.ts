import { NextFunction, Request, Response } from "express";

async function verifyToken(req:Request,res:Response,next:NextFunction){
    next();
}

export default verifyToken;