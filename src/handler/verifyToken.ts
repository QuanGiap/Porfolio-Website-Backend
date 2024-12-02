import { NextFunction, Request, Response } from "express";

//verify user before modify the data
async function verifyToken(req:Request,res:Response,next:NextFunction){
    next();
}

export default verifyToken;