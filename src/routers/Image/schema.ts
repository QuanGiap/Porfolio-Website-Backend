import zod from 'zod';
import { ExperienceType } from '@prisma/client';
export const post_schema = zod.object({
    portfolioData_id:zod.string().regex(/^[a-fA-F0-9]{24}$/,'website_design_id need to be valid ObjectID'),
    title:zod.string({required_error:'title is required in body',invalid_type_error:'title need to be a string'}),
    description:zod.string({required_error:'description is required in body',invalid_type_error:'description need to be a string'}),
    start_date:zod.string({required_error:'start_date is required in body',invalid_type_error:'start_date need to be a string'}).datetime({offset:true,message:'start date should be ISO type'}),
    end_date:zod.string({required_error:'end_date is required in body',invalid_type_error:'end_date need to be a string'}).datetime({offset:true,message:'start date should be ISO type'}),
    company_url:zod.string({invalid_type_error:'company_url need to be a string'}).optional(),
    skills:zod.array(zod.string({invalid_type_error:'item in skill need to be a string'})).optional(),
    role:zod.string({required_error:'role is required in body',invalid_type_error:'role need to be a string'}),
    type:zod.nativeEnum(ExperienceType,{required_error:'type is required in body',invalid_type_error:'type should be one of these: '+Object.values(ExperienceType).join(', ')})
})
export const date_schema = zod.string().datetime()
// model Experience {
//     id               String         @id @default(auto()) @map("_id") @db.ObjectId
//     portfolioData_id String         @db.ObjectId
//     portfolioData    PortfolioData  @relation(fields: [portfolioData_id], references: [id])
//     title            String
//     description      String
//     img_ids          String[]
//     start_date       DateTime
//     end_date         DateTime?
//     company_url      String?
//     skills           String[]
//     role             String
//     create_at        DateTime       @default(now())
//     last_update      DateTime       @default(now())
//     type             ExperienceType
  
//     @@index([portfolioData_id])
//   }