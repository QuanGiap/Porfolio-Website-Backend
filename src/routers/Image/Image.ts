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
const achievement_route = express.Router();

/**
 * Upload image to cloud and insert id to achievement data
 */
achievement_route.post('/',verifyToken,
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
        // const user_input = parsed_data[0];
        // //check if user is owned portfolio
        // const achievement = await prisma.achievement.findFirst({
        //     where:{
        //         id:user_input.achievement_id,
        //     },
        //     select:{
        //         portfolioData:{
        //             select:{
        //                 user_id:true,
        //             }
        //         }
        //     }
        // })
        // if(!achievement){
        //     return createErrRes({error:'Achievement data not found',res,status_code:404})
        // }
        // if(user.id !== achievement.portfolioData.user_id){
        //     return createErrRes({error:'Forbidden',res,status_code:403})
        // }

        // let imgs:fileUpload.UploadedFile[] = [];
        // //files.imgs exist since checked
        // if(Array.isArray(files.imgs)){
        //     imgs = files.imgs;
        // }else{
        //     imgs.push(files.imgs);
        // }
        // const idsPromise = imgs.map(file=>uploadImgToStorage(file));
        // const ids = await Promise.all(idsPromise);
        // await prisma.achievement.update({
        //     where:{
        //         id:user_input.achievement_id,
        //     },
        //     data:{
        //         img_ids:{
        //             push:ids,
        //         }
        //     }
        // })
        return res.json(`Insert image success`).status(201); 
})

/**
 * Update image and upload new image to cloud (if files exist) and update id to achievement data
 */
achievement_route.patch('/img',verifyToken,
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
        //check if user is owned portfolio
        //get imgs ids to know which one should delete or not exist
        // const achievement = await prisma.achievement.findFirst({
        //     where:{
        //         id:user_input.achievement_id,
        //     },
        //     select:{
        //         portfolioData:{
        //             select:{
        //                 user_id:true,
        //             }
        //         }
        //     }
        // })
        // if(!achievement){
        //     return createErrRes({error:'Achievement data not found',res,status_code:404})
        // }
        // if(user.id !== achievement.portfolioData.user_id){
        //     return createErrRes({error:'Forbidden',res,status_code:403})
        // }

        // let imgs:fileUpload.UploadedFile[] = [];
        // //files.imgs exist since checked
        // if(Array.isArray(files.imgs)){
        //     imgs = files.imgs;
        // }else{
        //     imgs.push(files.imgs);
        // }
        // const idsPromise = imgs.map(file=>uploadImgToStorage(file));
        // const ids = await Promise.all(idsPromise);
        // await prisma.achievement.update({
        //     where:{
        //         id:user_input.achievement_id,
        //     },
        //     data:{
        //         img_ids:{
        //             push:ids,
        //         }
        //     }
        // })
        return res.json(`Insert image success`).status(201); 
})

/**
 * Create new achievement 
 */
achievement_route.post('/',verifyToken,(req,res)=>{
    //create new about
})
achievement_route.patch('/',verifyToken,(req,res)=>{
    //update about
})
achievement_route.get('/:user_id/',(req,res)=>{
    //get about from user_id
})
export default achievement_route;