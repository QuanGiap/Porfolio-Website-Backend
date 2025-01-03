import { ExperienceType } from "@prisma/client";
import zod from "zod";
export const post_schema = zod.object(
  {
    portfolio_data_id: zod
      .string({
        required_error: "portfolio_data_id not found in body",
        invalid_type_error: "portfolio_data_id need to be an ObjectID",
      })
      .regex(
        /^[a-fA-F0-9]{24}$/,
        "website_design_id need to be valid ObjectID"
      ),
    title: zod.string({
      required_error: "title is missing in body",
      invalid_type_error: "title need to be a string",
    }),
    description: zod.string({
      required_error: "description is missing in body",
      invalid_type_error: "description need to be a string",
    }),
    start_date: zod
      .string({
        required_error: "start_date is missing in body",
        invalid_type_error: "start_date need to be a string",
      })
      .datetime({
        offset: true,
        message: "Invalid start_date, only accept ISO date",
      }),
    end_date: zod
      .string({
        required_error: "end_date is missing in body",
        invalid_type_error: "end_date need to be a string",
      })
      .datetime({
        offset: true,
        message: "Invalid end_date, only accept ISO date",
      }),
    company_url: zod
      .string({
        invalid_type_error: "company_url need to be a string",
      })
      .url("company_url need to be an valid url")
      .default(""),
    skills: zod
      .array(
        zod.string({
          invalid_type_error: "Element in skills need to be a string",
        }),
        { invalid_type_error: "skills should be string array" }
      )
      .default([]),
    role: zod.string({
      required_error: "role is missing in body",
      invalid_type_error: "role need to be a string",
    }),
    experience_type: zod
      .string({
        invalid_type_error: "title need to be a string",
      })
      .default(""),
    type: zod.nativeEnum(ExperienceType, {
      required_error: "experience_type is required in body",
      invalid_type_error:
        "experience_type is a string and only accept: " +
        Object.values(ExperienceType).join(", "),
    }),
  },
  { required_error: "Body not found" }
);

export const patch_schema = zod.object(
  {
    id: zod
      .string({
        required_error: "id not found in body",
        invalid_type_error: "id need to be an ObjectID string",
      })
      .regex(/^[a-fA-F0-9]{24}$/, "id need to be valid ObjectID"),
    title: zod
      .string({
        required_error: "title is missing in body",
        invalid_type_error: "title need to be a string",
      })
      .optional(),
    description: zod
      .string({
        required_error: "description is missing in body",
        invalid_type_error: "description need to be a string",
      })
      .optional(),
    start_date: zod
      .string({
        required_error: "start_date is missing in body",
        invalid_type_error: "start_date need to be a string",
      })
      .datetime({
        offset: true,
        message: "Invalid start_date, only accept ISO date",
      })
      .optional(),
    end_date: zod
      .string({
        required_error: "end_date is missing in body",
        invalid_type_error: "end_date need to be a string",
      })
      .datetime({
        offset: true,
        message: "Invalid end_date, only accept ISO date",
      })
      .optional(),
    company_url: zod
      .string({
        invalid_type_error: "company_url need to be a string",
      })
      .url("company_url need to be an valid url")
      .optional(),
    skills: zod
      .array(
        zod.string({
          invalid_type_error: "Element in skills need to be a string",
        }),
        { invalid_type_error: "skills should be string array" }
      )
      .default([]),
    role: zod
      .string({
        required_error: "role is missing in body",
        invalid_type_error: "role need to be a string",
      })
      .optional(),
    experience_type: zod
      .string({
        invalid_type_error: "title need to be a string",
      })
      .default(""),
    type: zod
      .nativeEnum(ExperienceType, {
        required_error: "experience_type is required in body",
        invalid_type_error:
          "experience_type is a string and only accept: " +
          Object.values(ExperienceType).join(", "),
      })
      .optional(),
  },
  { required_error: "Body not found" }
);
export const delete_schema = zod.object(
  {
    id: zod
      .string({
        required_error: "id not found in body",
        invalid_type_error: "id need to be an ObjectID",
      })
      .regex(/^[a-fA-F0-9]{24}$/, "id need to be valid ObjectID"),
  },
  { required_error: "Body not found" }
);
export const website_id_schema = zod
  .string({ required_error: "website_id is missing in url query" })
  .regex(/^[a-fA-F0-9]{24}$/, "website_design_id need to be valid ObjectID");
export const user_id_schema = zod
  .string({ required_error: "user_id is missing in url query" })
  .regex(/^[a-fA-F0-9]{24}$/, "user_id need to be valid ObjectID");
export const user_name_schema = zod.string({
  required_error: "user_name is a string",
});

// model Project {
//     id               String        @id @default(auto()) @map("_id") @db.ObjectId
//     portfolioData_id String        @db.ObjectId
//     portfolioData    PortfolioData @relation(fields: [portfolioData_id], references: [id])
//     tools            String[]
//     project_type     String        @default("")
//     title            String
//     description      String
//     skills           String[]
//     img_ids          String[]
//     start_date       DateTime
//     end_date         DateTime?
//     project_url      String?
//     create_at        DateTime      @default(now())
//     last_update      DateTime      @default(now())
  
//     @@index([portfolioData_id])
//   }