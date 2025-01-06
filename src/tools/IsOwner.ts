import { DataType } from "../Enum/Enum";
import prisma from "./PrismaSingleton";


const get_owner_id_handler:{[k in DataType]:(id:string)=>Promise<string|undefined>} = {
    'ACHIEVEMENT':getUserIdFromAchievement,
    'EXPERICENCE':getUserIdFromExperience,
    'PORTFOLIO_CONTENT':getUserIdFromPortfolioContent,
    'PORTFOLIO_IMAGE':getUserIdFromPortfolioImage,
    'PORTFOLIO_DATA':getUserIdFromPortfolioData,
    'PROJECT':getUserIdFromProject,
    'USER':getUserIdFromUser,
};

export default async function checkOwner(type:DataType,id:string,user_id_check:string){
    const owner_id = await get_owner_id_handler[type](id);
    const result = owner_id === user_id_check;
    if(owner_id){
        return {
            exist:true,
            owned:result,
        }
    }
    return {
        exist:false,
        owned:false,
    };
}

/**
 * Get user id from achievement
 */
async function getUserIdFromAchievement(id:string){
    const achievement = await prisma.achievement.findFirst({where:{
        id,
    },select:{
        portfolioData:{select:{user_id:true}}
    }})
    return achievement?.portfolioData.user_id;
}

/**
 * Get user id from portfolio data
 */
async function getUserIdFromPortfolioData(id:string){
    const port_data = await prisma.portfolioData.findFirst({where:{
        id,
    },select:{user_id:true}})
    return port_data?.user_id;
}

/**
 * Get user id from experience
 */
async function getUserIdFromExperience(id:string){
    const experience = await prisma.experience.findFirst({where:{
        id,
    },select:{
        portfolioData:{select:{user_id:true}}
    }})
    return experience?.portfolioData.user_id;
}

/**
 * Get user id from project
 */
async function getUserIdFromProject(id:string){
    const project = await prisma.project.findFirst({where:{
        id,
    },select:{
        portfolioData:{select:{user_id:true}}
    }})
    return project?.portfolioData.user_id;
}

/**
 * Get user id from portfolioContent
 */
async function getUserIdFromPortfolioContent(id:string){
    const portfolio_content = await prisma.portfolioContent.findFirst({where:{
        id,
    },select:{
        portfolioData:{select:{user_id:true}}
    }})
    return portfolio_content?.portfolioData.user_id;
}

/**
 * Get user id from portfolio_image
 */
async function getUserIdFromPortfolioImage(id:string){
    const portfolio_image = await prisma.portfolioImage.findFirst({where:{
        id,
    },select:{
        portfolioData:{select:{user_id:true}}
    }})
    return portfolio_image?.portfolioData.user_id;
}

/**
 * Get user id from usr
 * just check if exist
 */
async function getUserIdFromUser(id:string){
    const user = await prisma.portfolioImage.findFirst({where:{
        id,
    },select:{
        id:true,
    }})
    return user?.id;
}