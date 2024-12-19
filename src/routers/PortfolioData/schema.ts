import zod from 'zod';
export const post_schema = zod.object({
    portfolioData_id:zod.string().regex(/^[a-fA-F0-9]{24}$/,'website_design_id need to be valid ObjectID'),
    content:zod.string(),
    place_id:zod.string(),
})
export const website_id_schema = zod.string({required_error:'website_id is missing in url param'}).regex(/^[a-fA-F0-9]{24}$/,'website_design_id need to be valid ObjectID');
export const user_id_schema = zod.string({required_error:'user_id is missing in url query'}).regex(/^[a-fA-F0-9]{24}$/,'user_id need to be valid ObjectID');
export const user_name_schema = zod.string({required_error:'user_name is a string'});
