import express from "express";
import prisma from "../../tools/PrismaSingleton";
const test_route = express.Router();

test_route.post('/',async (req,res)=>{
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
        }
    })
    const portfolio_data = await prisma.portfolioData.create({
        data:{
            website_design_id:website_design.id,
            user_id:user_test.id,
        }
    })
    const arrLoopShort = [0,1,2,3,4];
    const arrLoopLong = [0,1,2,3,4,5,6,7,8,9];
    const projects = await prisma.project.createMany({
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
    const achievement = await prisma.achievement.createMany({
        data:arrLoopShort.map((index)=>{
            return{
                portfolioData_id:portfolio_data.id,
                title:'Title '+(index+1)+' for user '+user_test.user_name,
                description:'Description '+(index+1)+' for user '+user_test.user_name,
                img_ids:['imgs_id_1','imgs_id_2','imgs_id_3'],
                start_date:new Date(),
                end_date:new Date(),
                url:'project_url for user '+user_test.user_name,
            }
        })
    })
    return res.send('Test case created');
})