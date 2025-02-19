import zod from "zod";

export const patch_schema = zod.object(
  {
    first_name: zod
      .string({
        required_error: "first_name is missing in body",
        invalid_type_error: "first_name need to be a string",
      })
      .min(1, `first_name can't be empty string`)
      .regex(/^[\w\s-]+$/, "No special character allow in first_name").optional(),
    last_name: zod
      .string({
        required_error: "last_name is missing in body",
        invalid_type_error: "last_name need to be a string",
      })
      .min(1, `last_name can't be empty string`)
      .regex(/^[\w\s-]+$/, "No special character allow in last_name").optional(),
  },
  { required_error: "Body not found" }
);

export const website_id_schema = zod
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "website_design_id need to be valid ObjectID");
