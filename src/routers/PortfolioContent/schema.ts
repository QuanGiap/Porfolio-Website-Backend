import zod from 'zod';
const postSchema = zod.object({
    portfolioData_id:zod.string().regex(/^[a-fA-F0-9]{24}$/,'website_design_id need to be valid ObjectID'),
    content:zod.string(),
    place_id:zod.string(),
})
