import zod from "zod";
import { ImageType } from "../../Enum/Enum";
import { isValidId } from "../../tools/IdGenerator";
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
    }),{invalid_type_error:'ids should be a string array',required_error:'ids is required in json file'}).refine((arr)=>{
      for(let i=0;i<arr.length;i++){
        if(!isValidId(arr[i])&&arr[i]!=='NI') return false;
      }
      return true;
    },'Element in image_ids only accept valid ID from server provided or "NI" which stand for new image')
  },
  { required_error: "Json file not found" }
);
