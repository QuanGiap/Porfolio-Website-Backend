import { NextFunction, Request, Response } from "express";
import fileUpload, { UploadedFile } from 'express-fileupload';
import { createErrRes } from "../tools/ResTool";
const MB_TO_BYTE = 1024*1024;
const MAX_IMAGE_SIZE = 3 * MB_TO_BYTE; //3mb
const MAX_IMAGE_COUNT = 9;

/**
 * Create file uploader middle ware
 */
const uploadManager = fileUpload({
  limits:{
    fileSize:MAX_IMAGE_SIZE,
    //add 1 in this will help check if user send more files than limit
    files:MAX_IMAGE_COUNT+1,
  },
  abortOnLimit:true,
  // safeFileNames:true,
  limitHandler:(req,res,next)=>{
    return createErrRes({res,status_code:413,error:'Uploaded image should be less than '+ Math.trunc(MAX_IMAGE_SIZE/MB_TO_BYTE) +'mb and upload '+MAX_IMAGE_COUNT+' images each time'});
  }
})

/**
 * Checking if uploaded file is valid including:
 *    in right form field (images)
 *    in limit amount of files
 *    correct file type (jpg)
 */
function checkValidImgMiddleware(req:Request,res:Response,next:NextFunction,required=true){
  if((!req.files || !req.files?.images) &&!required){
    //image not found but not required
    return next();
  }
  //check if files exist or file is in the correct field
  if(!req.files || !req.files.images){
    const err = 'Images not found or not set in the right fields form. Only accept fields "images"'
    return createErrRes({res,error:err,status_code:400});
  }
  const isArr = Array.isArray(req.files.images);
  //check if number of files is in the limit count
  if(isArr && (req.files.images as UploadedFile[]).length > MAX_IMAGE_COUNT){
    const err = 'Only upload '+MAX_IMAGE_COUNT+' at a time';
    return createErrRes({res,error:err,status_code:413});
  }
  // check if files is jpg img
  let imgs = [];
  if(isArr){
    imgs = (req.files.images as UploadedFile[]);
  }else{
    imgs.push(req.files.images as UploadedFile)
  }
  for(let i=0;i<imgs.length;i++){
    const img = imgs[i]
    if(img.mimetype!=='image/jpeg' && img.mimetype!=='image/jpg'){
      const err = 'File should be an jpg/jpeg type. Found '+img.mimetype;
      return createErrRes({res,error:err,status_code:400});
    }
  }
  return next();
}

async function checkValidJsonMiddleware(req:Request,res:Response,next:NextFunction){
  //check if files exist or file is in the correct field
  if(!req.files || !req.files.json){
    const err = 'Json not found or not set in the right fields form. Only accept fields "json"'
    return createErrRes({res,error:err,status_code:400});
  }
  //auto convert to array if there is multiple json
  const isArr = Array.isArray(req.files.json);
  //check if only 1 json
  if(isArr){
    const err = 'Only upload 1 json at a time. Found '+(req.files.json as UploadedFile[]).length;
    return createErrRes({res,error:err,status_code:413});
  }
  // check if files is json type
  let json = req.files.json as UploadedFile;
  if(json.mimetype !== 'application/json'){
    const err = '"json" field only accept json file'
    return createErrRes({res,error:err,status_code:400});
  }
  //application/json will make json.data a string
  req.body = JSON.parse(json.data as unknown as string);
  next();
}


/**
 * Upload img to google storage
 * @param file 
 * @returns id of the img
 */

export default uploadManager;
export {
  checkValidImgMiddleware,
  uploadManager,
  checkValidJsonMiddleware,
}