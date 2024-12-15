import express from "express";
import prisma from "../../tools/PrismaSingleton";
const test_route = express.Router();

//create test data 
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
            title:'Title for user '+user_test.user_name,
            desciption:'desciption for user '+user_test.user_name,
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

//create test image


export default test_route;