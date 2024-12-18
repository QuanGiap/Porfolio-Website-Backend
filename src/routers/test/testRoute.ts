import express from "express";
import prisma from "../../tools/PrismaSingleton";
import fileUpload from 'express-fileupload';
const test_route = express.Router();
test_route.use(fileUpload());
test_route.get('/',async (req,res)=>{
    const user_count = await prisma.user.count();
    const user_test = await prisma.user.create({
        data:{
            first_name:'User',
            last_name:'Test',
            user_name:'user_'+user_count,
            password:'passwordLength',
            email:'test_email'+user_count+'@gmail.com',
            phone_number:'123456789',
            email_verified:true,
            phone_verified:true,
        }
    })
    const website_design = await prisma.websiteDesign.create({
        data:{
            url_website:'randome_website_design_url.com',
            creator_id:user_test.id,
        }
    })
    const portfolio_data = await prisma.portfolioData.create({
        data:{
            website_design_id:website_design.id,
            user_id:user_test.id,
            title:'',
            desciption:'',
        }
    })
    const arrLoopShort = [0,1,2,3,4];
    const arrLoopLong = [0,1,2,3,4,5,6,7,8,9];
    const projectsPromise = prisma.project.createMany({
        data:arrLoopShort.map((index)=>{
            return{
                portfolioData_id:portfolio_data.id,
                tools:['Tool 1','Tool 2','Tool 3'],
                project_type:'Project type '+(index+1)+' for user '+user_test.user_name,
                title:'Title '+(index+1)+' for user '+user_test.user_name,
                description:'Description '+(index+1)+' for user '+user_test.user_name,
                skills:['Skill 1','Skill 2','Skill 3'],
                img_ids:['imgs_id_1','imgs_id_2','imgs_id_3'],
                start_date:new Date(),
                project_url:'project_url for user '+user_test.user_name,
            }
        })
    })
    const achievementPromise = prisma.achievement.createMany({
        data:arrLoopShort.map((index)=>{
            return{
                portfolioData_id:portfolio_data.id,
                title:'Title '+(index+1)+' for user '+user_test.user_name,
                description:'Description '+(index+1)+' for user '+user_test.user_name,
                img_ids:['imgs_id_1','imgs_id_2','imgs_id_3'],
                start_date:new Date(2020),
                end_date:new Date(),
                achievement_url:'achievement_url for user '+user_test.user_name,
            }
        })
    })
    const expsPromise = prisma.experience.createMany({
        data:arrLoopShort.map((index)=>{
            return{
                portfolioData_id:portfolio_data.id,
                title:'Title '+(index+1)+' for user '+user_test.user_name,
                description:'Description '+(index+1)+' for user '+user_test.user_name,
                img_ids:['imgs_id_1','imgs_id_2','imgs_id_3'],
                start_date:new Date(2020),
                end_date:new Date(),
                skills:[],
                type:'INTERNSHIP',
                role:'Role for user '+user_test.user_name,
                company_url:'internship_url for user '+user_test.user_name,
            }
        })
    })
    const portfolio_contentsPromise = prisma.portfolioContent.createMany({
        data:arrLoopLong.map(index=>{
            return{
                place_id:'Place id number '+index,
                content:'Context for user '+user_test.user_name,
                portfolioData_id:portfolio_data.id,
            }
        })
    })
    const portfolio_imgsPromise = prisma.portfolioImage.createMany({
        data:arrLoopLong.map(index=>{
            return{
                place_id:'Place id number '+index,
                portfolioData_id:portfolio_data.id,
                image_name:'img name user '+user_test.user_name,
                image_size:2000,
                image_id:'img id user '+user_test.user_name
            }
        })
    })
    await Promise.all([projectsPromise,achievementPromise,expsPromise,portfolio_contentsPromise,portfolio_imgsPromise])
    return res.send('Test case created');
})
test_route.post('/image',async (req,res)=>{
    if (!req.files) {
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
    res.status(200).json({ message:'Image uploaded successfully' });
})

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