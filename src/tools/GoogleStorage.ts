import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
import { UploadedFile } from 'express-fileupload';
import generateFileId from './IdGenerator';
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
async function uploadImgToStorage(file:UploadedFile){
  const bucket = process.env.GCS_BUCKET;
  if(!bucket){
    throw new Error('Google bucket missing');
  }
  const id = generateFileId();
  const blob = storage.bucket(bucket).file(id+'.jpg');
      const blobStream = blob.createWriteStream({
            resumable: false,
      });
      await new Promise((resolve, reject) => {
        blobStream.on("finish", async () => {
          try {
            // Make the file public
            await blob.makePublic();
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

async function removeImgFromStorage(img_id:string){
  const bucket = process.env.GCS_BUCKET;
  if(!bucket){
    throw new Error('Google bucket missing');
  }
  const result = await storage.bucket(bucket).file(img_id+'.jpg').delete();
  return result;
}
export default storage;
export {
  uploadImgToStorage,
  removeImgFromStorage,
}