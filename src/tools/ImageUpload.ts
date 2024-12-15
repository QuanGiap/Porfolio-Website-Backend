import { Storage } from "@google-cloud/storage";
import multer, { memoryStorage } from "multer";
import dotenv from 'dotenv';
import { Router } from "express";

const MAX_IMAGE_SIZE = 3000000;

// import MulterGoogleCloudStorage from "multer-google-storage";
dotenv.config();
const storage = new Storage({
    credentials: {
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key:process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        universe_domain:process.env.UNIVERSAL_DOMAIN,
    }
})
const img_upload_hanlder = multer({storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg") {
      return cb(new Error("Only .jpg files are allowed!")); // Reject the file
    }
    //img size is bigger than required -> reject 
    if(file.size>MAX_IMAGE_SIZE){
       return cb(new Error('Image should be less than 3 mb'));
    }
    return cb(null, true); // Accept the file
  },})

const image_test_route = Router();

image_test_route.post('/',img_upload_hanlder.array('file',5),async (req,res)=>{
    try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).send("No files uploaded.");
        }
        // Array to store public URLs of uploaded files
        const publicUrls:string[] = [];
        // Iterate through each file and upload to GCS
        const files = req.files;
        console.log(files);
        // for (const file of req.files) {
        //   const blob = storage.bucket(process.env.GCS_BUCKET||'').file(file.originalname);
        //   const blobStream = blob.createWriteStream({
        //     resumable: false,
        //   });
    
        //   await new Promise((resolve, reject) => {
        //     blobStream.on("finish", async () => {
        //       try {
        //         // Make the file public
        //         await blob.makePublic();
    
        //         // Add the public URL to the array
        //         const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        //         publicUrls.push(publicUrl);
    
        //         resolve(0);
        //       } catch (err) {
        //         reject(err);
        //       }
        //     });
    
        //     blobStream.on("error", (err) => {
        //       console.error(err);
        //       reject(err);
        //     });
    
        //     blobStream.end(file.buffer);
        //   });
        // }
        // // Respond with the public URLs
        res.status(200).send({ publicUrls });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred during the upload." });
      }
})


export default image_test_route; 

//create function able to upload the img to storage
//use multer-google-storage to upload