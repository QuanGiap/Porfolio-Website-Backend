import zod from "zod";
import { ImageType } from "../../Enum/Enum";
export const post_img_schema = zod.object({
  id:zod
      .string({
        required_error: "type id is required in json",
        invalid_type_error: "id need to be a valid ObjectID",
      })
      .regex(/^[a-fA-F0-9]{24}$/, "id need to be valid ObjectID"),
    type: zod.nativeEnum(ImageType, {
      required_error:"type is required in json. Only accept enum: " +
        Object.values(ImageType).join(", "),
      invalid_type_error:
        "type need to be an valid enum. Only accept: " +
        Object.values(ImageType).join(", "),
    }),
    image_ids:zod.array(zod.string({
      required_error: "ids not found in json",
      invalid_type_error: "ids need to be an ObjectID",
    }),{invalid_type_error:'ids should be a string array',required_error:'ids is required in json file'})
  },
  { required_error: "Json file not found" }
);
