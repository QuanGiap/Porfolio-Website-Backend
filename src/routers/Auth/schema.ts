import zod from "zod";
export const post_sign_up_schema = zod.object({
  first_name: zod
    .string({
      required_error: "first_name is missing in body",
      invalid_type_error: "first_name need to be a string",
    })
    .min(1, `first_name can't be empty string`).regex(/^[\w\s-]+$/,'No special character allow in first_name'),
  last_name: zod
    .string({
      required_error: "last_name is missing in body",
      invalid_type_error: "last_name need to be a string",
    })
    .min(1, `last_name can't be empty string`).regex(/^[\w\s-]+$/,'No special character allow in last_name'),
  user_name: zod
    .string({
      required_error: "user_name is missing in body",
      invalid_type_error: "user_name need to be a string",
    })
    .min(1, `user_name can't be empty string`).regex(/^[\w\s-]+$/,'No special character allow in user_name'),
  email: zod
    .string({
      required_error: "email is missing in body",
      invalid_type_error: "email need to be a string",
    })
    .email("Invalid email address"),
  password: zod
    .string({
      required_error: "password is missing in body",
      invalid_type_error: "password need to be a string",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Invalid password, minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
});
export const post_sign_in_schema = zod.object({
    email:zod
    .string({
      required_error: "email is missing in body",
      invalid_type_error: "email need to be a string",
    })
    .email("Invalid email address"),
    password: zod
    .string({
      required_error: "password is missing in body",
      invalid_type_error: "password need to be a string",
    }),
})

export const post_request_reset_pass_schema = zod.object({
  email:zod
  .string({
    required_error: "email is missing in body",
    invalid_type_error: "email need to be a string",
  })
  .email("Invalid email address"),
})