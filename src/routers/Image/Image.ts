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
const image_route = express.Router();

/**
 * Upload image to cloud and insert id to data table base on Image Type
 */
image_route.post('/',verifyToken,
    uploadManager,
    checkValidImgMiddleware,
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
        return res.json(`Insert image success`).status(201); 
})

export default image_route;