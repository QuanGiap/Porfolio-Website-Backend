import express, { NextFunction, Request, Response } from "express";
import prisma from "../../tools/PrismaSingleton";
import multer from "multer";
const test_route = express.Router();

test_route.get('/',async (req,res)=>{
    return res.json({message:'Test case created'});
})
// test_route.post('/image',imgUploadMiddleware,async (req,res)=>{
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).send("No files uploaded.");
//     }
//     // Array to store public URLs of uploaded files
//     const publicUrls:string[] = [];
    
//     // Iterate through each file and upload to GCS
//     const files = req.files;
//     console.log(files);
//     // for (const file of req.files) {
//     //   const blob = storage.bucket(process.env.GCS_BUCKET||'').file(file.originalname);
//     //   const blobStream = blob.createWriteStream({
//     //     resumable: false,
//     //   });

//     //   await new Promise((resolve, reject) => {
//     //     blobStream.on("finish", async () => {
//     //       try {
//     //         // Make the file public
//     //         await blob.makePublic();

//     //         // Add the public URL to the array
//     //         const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
//     //         publicUrls.push(publicUrl);

//     //         resolve(0);
//     //       } catch (err) {
//     //         reject(err);
//     //       }
//     //     });

//     //     blobStream.on("error", (err) => {
//     //       console.error(err);
//     //       reject(err);
//     //     });

//     //     blobStream.end(file.buffer);
//     //   });
//     // }
//     // // Respond with the public URLs
//     res.status(200).json({ message:'Image uploaded successfully' });
// })

// test_route.use((err:any,req:Request,res:Response,next:NextFunction)=>{
//     if (err instanceof multer.MulterError) {
//         if (err.code === "LIMIT_UNEXPECTED_FILE") {
//           // Handle the unexpected field error here
//           console.log('sending res')
//           return res.status(400).send({ error: 'Unexpected field, only accept "image"' });
//         } else {
//           // Handle other Multer errors here
//           return res.status(400).json({ error: err.message });
//         }
//       } else if(err){
//         next(err);
//       } 
// })


export default test_route;