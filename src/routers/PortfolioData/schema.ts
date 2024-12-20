import zod from 'zod';
export const post_content_schema = zod.object({
    portfolioData_id:zod.string({required_error:'portfolioData_id is missing in body',invalid_type_error:'portfolioData_id need to be a string'}).regex(/^[a-fA-F0-9]{24}$/,'portfolioData_id need to be valid ObjectID'),
    content:zod.string({required_error:'content is missing in body',invalid_type_error:'content need to be a string'}),
    place_id:zod.string({required_error:'place_id is missing in body',invalid_type_error:'place_id need to be a string'}),
})
export const post_img_schema = zod.object({
    portfolioData_id:zod.string({required_error:'portfolioData_id is missing in json',invalid_type_error:'portfolioData_id need to be a string'}).regex(/^[a-fA-F0-9]{24}$/,'portfolioData_id need to be valid ObjectID'),
    place_id:zod.string({required_error:'place_id is missing in json',invalid_type_error:'place_id need to be a string'}),
})
export const website_id_schema = zod.string({required_error:'website_id is missing in url param'}).regex(/^[a-fA-F0-9]{24}$/,'website_design_id need to be valid ObjectID');
export const user_id_schema = zod.string({required_error:'user_id is missing in url query'}).regex(/^[a-fA-F0-9]{24}$/,'user_id need to be valid ObjectID');
export const user_name_schema = zod.string({required_error:'user_name is a string'});
