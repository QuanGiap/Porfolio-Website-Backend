import zod from "zod";
export const post_schema = zod.object(
  {
    portfolioData_id: zod
      .string()
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
    achievement_type: zod
      .string({
        invalid_type_error: "achievement_type need to be a string",
      })
      .default(""),
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
    achievement_url: zod
      .string({
        invalid_type_error: "achievement_url need to be a string",
      })
      .url("achievement_url need to be an valid url")
      .default(""),
  },
  { required_error: "Body data not found" }
);
export const post_img_schema = zod.object({
  achievement_id: zod
    .string({
      required_error: "achievement_id not found in json",
      invalid_type_error: "achievement_id need to be an ObjectID",
    })
    .regex(/^[a-fA-F0-9]{24}$/, "website_design_id need to be valid ObjectID"),
});
export const patch_img_schema = zod.object({
    achievement_id: zod
      .string({
        required_error: "achievement_id not found in json",
        invalid_type_error: "achievement_id need to be an ObjectID",
      })
      .regex(/^[a-fA-F0-9]{24}$/, "website_design_id need to be valid ObjectID"),
  });
export const website_id_schema = zod
  .string({ required_error: "website_id is missing in url query" })
  .regex(/^[a-fA-F0-9]{24}$/, "website_design_id need to be valid ObjectID");
export const user_id_schema = zod
  .string({ required_error: "user_id is missing in url query" })
  .regex(/^[a-fA-F0-9]{24}$/, "user_id need to be valid ObjectID");
export const user_name_schema = zod.string({
  required_error: "user_name is a string",
});

// model Achievement {
//     id               String        @id @default(auto()) @map("_id") @db.ObjectId
//     portfolioData_id String        @db.ObjectId
//     portfolioData    PortfolioData @relation(fields: [portfolioData_id], references: [id])
//     title            String
//     description      String
//   achievement_type String        @default("")
//     img_ids          String[]
//     start_date       DateTime
//     end_date         DateTime
//     achievement_url  String?
//     create_at        DateTime      @default(now())
//     last_update      DateTime      @default(now())

//     @@index([portfolioData_id])
//   }