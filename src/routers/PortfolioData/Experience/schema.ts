import zod from 'zod';
export const post_schema = zod.object({
    portfolio_data_id:zod.string().regex(/^[a-fA-F0-9]{24}$/,'website_design_id need to be valid ObjectID'),
    content:zod.string(),
    place_id:zod.string(),
})
export const website_id_schema = zod.string({required_error:'website_id is missing in url query'}).regex(/^[a-fA-F0-9]{24}$/,'website_design_id need to be valid ObjectID');
export const user_id_schema = zod.string({required_error:'user_id is missing in url query'}).regex(/^[a-fA-F0-9]{24}$/,'user_id need to be valid ObjectID');
export const user_name_schema = zod.string({required_error:'user_name is a string'});

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