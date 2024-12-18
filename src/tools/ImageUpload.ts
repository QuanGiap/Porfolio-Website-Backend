import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; //3mb
const MAX_IMAGE_COUNT = 6; //3mb

// import MulterGoogleCloudStorage from "multer-google-storage";
dotenv.config();
const storage = new Storage({
  credentials: {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    universe_domain: process.env.UNIVERSAL_DOMAIN,
  },
});
// const upload = multer({
//   storage: memoryStorage(),
//   limits: { fileSize: MAX_IMAGE_SIZE },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg") {
//       return cb(new Error("Only .jpg files are allowed!")); // Reject the file
//     }
//     //img size is bigger than required -> reject
//     if (file.size > MAX_IMAGE_SIZE) {
//       return cb(new Error("Image should be less than 3 mb"));
//     }
//     return cb(null, true); // Accept the file
//   },
// });
// function errorHandler(err:any,res:Response,next:NextFunction){
//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_UNEXPECTED_FILE") {
//       // Handle the unexpected field error here
//       console.log('sending res')
//       return res.status(400).send({ error: 'Unexpected field, only accept "image"' });
//     } else {
//       // Handle other Multer errors here
//       return res.status(400).json({ error: err.message });
//     }
//   } else if (err) {
//     // Handle other errors here
//     return res.status(500).json({ error: err.message });
//   } else {
//     next();
//   }
// }
// const img_upload_hanlder = upload.single("image");
// function imgUploadMiddleware(req: Request, res: Response, next: NextFunction) {
//   img_upload_hanlder(req, res, (err)=>errorHandler(err,res,next))
// }
// export default imgUploadMiddleware;
