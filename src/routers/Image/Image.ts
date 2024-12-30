import express from 'express';
import verifyToken from '../../handler/VerifyToken';
import uploadManager, { checkValidImgMiddleware, checkValidJsonMiddleware } from '../../handler/UploadManager';
import { uploadImgToStorage } from '../../tools/GoogleStorage';
import { checkValidInput } from '../../tools/SchemaTool';
import { post_img_schema } from './schema';
import fileUpload from 'express-fileupload';
import prisma from '../../tools/PrismaSingleton';
import { createErrRes } from '../../tools/ResTool';
import { UserType } from '../../type/Type';
import { checkIdsImage, getIdsImage } from './tool';
import { ImageType } from '../../Enum/Enum';
const image_route = express.Router();

/**
 * Upload image to cloud and insert id to data table base on Image Type
 */
image_route.post('/',verifyToken,
    uploadManager,
    (...params)=>checkValidImgMiddleware(...params,false),
    checkValidJsonMiddleware
    ,async (req,res)=>{
        //files exist since checked
        const files = req.files as fileUpload.FileArray 
        //req.body.user from verifyToken
        const user = req.body.user as UserType;
        //check user input
        const {parsed_data,err_message} = checkValidInput([post_img_schema],[files.json]);
        if(err_message.error){
            return createErrRes({...err_message,res});
        }
        const user_input = parsed_data[0];
        //not allow type USER or PORTFOLIO to use this service
        if(user_input.type == ImageType.USER || user_input.type == ImageType.PORTFOLIO){
            return createErrRes({error:user_input.type+' type is not allowed for this service',res});
        }
        let imgs:fileUpload.UploadedFile[] = [];
        if(files.images){
            if(Array.isArray(files.images)) imgs=files.images;
            else imgs.push(files.images); 
        }
        const img_ids = await getIdsImage(parsed_data[0]);
        //check if type data exist
        if(!img_ids){
            return createErrRes({error:user_input.type+' data not found',res,status_code:404})
        }
        const chech_id_result = checkIdsImage(img_ids,user_input.image_ids);
        if(chech_id_result.errors)
        return res.json(`Insert image success`).status(201); 
})

export default image_route;