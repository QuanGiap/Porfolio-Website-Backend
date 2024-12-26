import { ErrorRequestHandler, NextFunction,Response,Request } from "express"

function errorHandler(err:ErrorRequestHandler, req:Request, res:Response, next:NextFunction) {
    console.error(err);
    res.status(500).send('Something broke!')
}