import { NextFunction, Request, Response } from "express";
import fileUpload, { UploadedFile } from 'express-fileupload';
import { createErrRes } from "./ResTool";
import storage from "./GoogleStorage";
import generateFileId from "./IdGenerator";
const MB_TO_BYTE = 1024*1024
const MAX_IMAGE_SIZE = 3 * MB_TO_BYTE; //3mb
const MAX_IMAGE_COUNT = 9;

/**
 * Create file uploader middle ware
 */
const upload = fileUpload({
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
function checkValidMiddleware(req:Request,res:Response,next:NextFunction){
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
  next();
}

/**
 * Upload img to google storage
 * @param file 
 * @returns id of the img
 */
async function uploadImgToStorage(file:fileUpload.UploadedFile){
  let publicUrl = '';
  const bucket = process.env.GCS_BUCKET;
  if(!bucket){
    throw new Error('Google bucket missing');
  }
  const id = generateFileId();
  const blob = storage.bucket(process.env.GCS_BUCKET||'').file(id+'.jpg');
      const blobStream = blob.createWriteStream({
            resumable: false,
      });
      await new Promise((resolve, reject) => {
        blobStream.on("finish", async () => {
          try {
            // Make the file public
            await blob.makePublic();
            publicUrl = `https://storage.googleapis.com/${process.env.G}/${blob.name}`;
            resolve(0);
          } catch (err) {
            reject(err);
          }
        });

        blobStream.on("error", (err) => {
          console.error(err);
          reject(err);
        });

        blobStream.end(file.data);
  })
  return id;
}
const imgUploadMiddleware = [upload, checkValidMiddleware]
export {
  uploadImgToStorage,
  imgUploadMiddleware
}