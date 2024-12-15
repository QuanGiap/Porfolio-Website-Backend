import {Response} from 'express'
interface createErrResParam{
    error:string|null,
    errors?:string[]|null,
    res: Response,
    status_code?:number
}
export function createErrRes(param:createErrResParam){
    const {error,errors,res,status_code=400} = param;
    return res.status(status_code).json({
        error,
        errors:errors?errors:[error],
    })
}