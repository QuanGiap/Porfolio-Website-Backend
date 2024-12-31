import z from "zod";
import { post_img_schema } from "./schema";
import { ImageType } from "../../Enum/Enum";
import prisma from "../../tools/PrismaSingleton";
import fileUpload from "express-fileupload";
import {
  removeImgFromStorage,
  uploadImgToStorage,
} from "../../tools/GoogleStorage";

//get img_ids from 3 type Project, achienvement, experience
const get_img_ids_handler: {
  [key in ImageType]: (
    id: string
  ) => Promise<{ img_ids: string[]; owner_id: string | undefined }>;
} = {
  PROJECT: getImgsFromProject,
  ACHIEVEMENT: getImgsFromAchievement,
  EXPERICENCE: getImgsFromExprience,
  PORTFOLIO: (id) => new Promise((resolve) => resolve({img_ids:[],owner_id:undefined})),
  USER: (id) => new Promise((resolve) => resolve({img_ids:[],owner_id:undefined})),
};

const update_img_ids_handler: {
  [key in ImageType]: (id_images: string[], id: string) => Promise<string[]>;
} = {
  PROJECT: updateImgsFromProject,
  ACHIEVEMENT: updateImgsFromAchievement,
  EXPERICENCE: updateImgsFromExprience,
  PORTFOLIO: (id) => new Promise((resolve) => resolve([])),
  USER: (id) => new Promise((resolve) => resolve([])),
};

const getIdsImageAndCheckOwner = async (
  user_input: z.infer<typeof post_img_schema>
) => {
  const img_ids = await get_img_ids_handler[user_input.type](user_input.id);
  return img_ids;
};

const updateImageIdsToDB = async(img_ids:string[],id:string,type:ImageType)=>{
    return await update_img_ids_handler[type](img_ids,id);
}

const checkIdsImage = (image_ids: string[], user_input_image_ids: string[]) => {
  const errors = [];
  const id_set = new Set<string>();
  let new_imgs_count = 0;
  for (let i = 0; i < image_ids.length; i++) {
    const id = image_ids[i];
    id_set.add(id);
  }
  for (let i = 0; i < user_input_image_ids.length; i++) {
    const id = user_input_image_ids[i];
    if (id === "NI") {
      new_imgs_count++;
    } else if (id_set.has(id)) {
      id_set.delete(id);
    } else {
      errors.push(id + " image not found");
    }
  }
  return {
    errors: errors.length === 0 ? null : errors,
    new_imgs_count,
    remove_image_ids: [...id_set.values()],
  };
};

const updateIdsArrDB = async (
  type: ImageType,
  img_ids: string[],
  id: string
) => {
  return await update_img_ids_handler[type](img_ids, id);
};

/**
 * Upload new image to storage and remove other unnecessary img from storage
 * And create new array that replace any 'NI' element in user_input_image_ids with new id
 * @param user_input_image_ids
 * @param files
 * @param delete_img_ids
 * @returns array of images base on user_input_image_ids
 */
const uploadAndRemoveImage = async (
  user_input_image_ids: string[],
  files: fileUpload.UploadedFile[],
  delete_img_ids: string[]
) => {
    //delete img from cloud
    await Promise.all(
        delete_img_ids.map((img_id) => removeImgFromStorage(img_id))
    );
  //upload img to cloud
  const new_imgs_ids = await Promise.all(
    files.map((file) => uploadImgToStorage(file))
  );
  let index_new_image = -1;
  return user_input_image_ids.map((id) => {
    if (id === "NI") {
      index_new_image++;
      return new_imgs_ids[index_new_image];
    }
    return id;
  });
};

/**
 * Get img_ids from project
 * @param id
 * @returns img ids array or null if not found
 */
async function getImgsFromProject(id: string) {
  const project = await prisma.project.findFirst({
    where: { id },
    select: { img_ids: true, portfolioData: { select: { user_id: true } } },
  });
  return {
    img_ids: project?.img_ids || [],
    owner_id: project?.portfolioData.user_id,
  };
}

/**
 * Update img_ids from project
 * @param id
 * @returns img ids array
 */
async function updateImgsFromProject(id_images: string[], id: string) {
  const project = await prisma.project.update({
    where: { id },
    data: { img_ids: id_images },
    select: { img_ids: true },
  });
  return project.img_ids;
}

/**
 * Get img_ids from achievement
 * @param id
 * @returns img ids array or null if not found
 */
async function getImgsFromAchievement(id: string) {
  const achievement = await prisma.achievement.findFirst({
    where: { id },
    select: { img_ids: true, portfolioData: { select: { user_id: true } } },
  });
  return {
    img_ids: achievement?.img_ids || [],
    owner_id: achievement?.portfolioData.user_id,
  };
}

/**
 * Update img_ids from achievement
 * @param id
 * @returns img ids array
 */
async function updateImgsFromAchievement(id_images: string[], id: string) {
  const achievement = await prisma.achievement.update({
    where: { id },
    data: { img_ids: id_images },
    select: { img_ids: true },
  });
  return achievement.img_ids;
}

/**
 * Get img_ids from exprience
 * @param id
 * @returns img ids array or null if not found
 */
async function getImgsFromExprience(id: string) {
  const experience = await prisma.experience.findFirst({
    where: { id },
    select: { img_ids: true, portfolioData: { select: { user_id: true } } },
  });
  return {
    img_ids: experience?.img_ids || [],
    owner_id: experience?.portfolioData.user_id,
  };
}

/**
 * Update img_ids from exprience
 * @param id
 * @returns img ids array
 */
async function updateImgsFromExprience(id_images: string[], id: string) {
  const experience = await prisma.experience.update({
    where: { id },
    data: { img_ids: id_images },
    select: { img_ids: true },
  });
  return experience.img_ids;
}

export { getIdsImageAndCheckOwner, checkIdsImage, uploadAndRemoveImage, updateIdsArrDB,updateImageIdsToDB };
