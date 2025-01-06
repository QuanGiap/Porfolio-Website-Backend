import express from "express";
import verifyToken from "../../handler/VerifyToken";
import uploadManager, {
  checkValidImgMiddleware,
  checkValidJsonMiddleware,
} from "../../handler/UploadManager";
import {
  removeImgFromStorage,
  uploadImgToStorage,
} from "../../tools/GoogleStorage";
import { checkValidInput } from "../../tools/SchemaTool";
import {
  post_img_schema,
  post_img_content_schema,
  patch_img_content_schema,
} from "./schema";
import fileUpload from "express-fileupload";
import prisma from "../../tools/PrismaSingleton";
import { createErrRes } from "../../tools/ResTool";
import { UserType } from "../../type/Type";
import {
  checkIdsImage,
  getIdsImageAndCheckOwner,
  updateImageIdsToDB,
  uploadAndRemoveImage,
} from "./tool";
import { ImageType } from "../../Enum/Enum";
const image_route = express.Router();

/**
 * Upload image to cloud and insert id to data table base on Image Type
 */
image_route.post(
  "/",
  verifyToken,
  uploadManager,
  (...params) => checkValidImgMiddleware(...params, false),
  checkValidJsonMiddleware,
  async (req, res) => {
    //files exist since checked
    const files = req.files as fileUpload.FileArray;
    //req.user from verifyToken
    const user = req.user as UserType;
    //check user input
    const { parsed_data, err_message } = checkValidInput(
      [post_img_schema],
      [files.json]
    );
    if (err_message.error) {
      return createErrRes({ ...err_message, res });
    }
    const user_input = parsed_data[0];
    //not allow type USER or PORTFOLIO to use this service
    if (
      user_input.type == ImageType.USER ||
      user_input.type == ImageType.PORTFOLIO
    ) {
      return createErrRes({
        error: user_input.type + " type is not allowed for this service",
        res,
      });
    }
    let img_files: fileUpload.UploadedFile[] = [];
    if (files.images) {
      if (Array.isArray(files.images)) img_files = files.images;
      else img_files.push(files.images);
    }
    //count how many new img need to insert
    //This help check if number of new image is equal number of element 'NI' in user input
    const new_imgs_count = user_input.image_ids.reduce((count, cur) => {
      if (cur === "NI") return count + 1;
      return count;
    }, 0);
    if (new_imgs_count !== img_files.length) {
      return createErrRes({
        error:
          'Amount of new file images is not equal to amount of "NI" element in user_input',
        res,
      });
    }

    const getResult = await getIdsImageAndCheckOwner(parsed_data[0]);
    //check if type data exist
    if (!getResult.owner_id) {
      return createErrRes({
        error: user_input.type + " data not found",
        res,
        status_code: 404,
      });
    }
    // check if user is owner
    if (getResult.owner_id !== user.id) {
      return createErrRes({
        error: "Forbidden",
        res,
        status_code: 401,
      });
    }
    const { errors, remove_image_ids } = checkIdsImage(
      getResult.img_ids,
      user_input.image_ids
    );
    if (errors) {
      return createErrRes({ error: errors[0], errors, res });
    }

    const updated_img_id = await uploadAndRemoveImage(
      user_input.image_ids,
      img_files,
      remove_image_ids
    );

    //update img_ids to database
    await updateImageIdsToDB(updated_img_id, user_input.id, user_input.type);

    return res.json(`Insert image success`).status(201);
  }
);

/**
 * Upload image to cloud and insert id to user data base.
 */
image_route.post(
  "/user",
  verifyToken,
  (...params) => checkValidImgMiddleware(...params, true, false),
  async (req, res) => {
    //req.user from verify token
    const user = req.user as UserType;
    //only 1 image is accepted, it checked
    const img_file = (req.files as fileUpload.FileArray)
      .images as fileUpload.UploadedFile;
    //get img_id from user
    const user_data = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        img_id: true,
      },
    });
    //check if user data found
    if (!user_data) {
      return createErrRes({
        res,
        error: "User data not found",
        status_code: 404,
      });
    }
    //if img_id exist delete that image from storage
    const deletePromise = user_data.img_id
      ? removeImgFromStorage(user_data.img_id)
      : new Promise((resolve) => resolve(0));
    //upload new image to storage
    const uploadPromise = uploadImgToStorage(img_file);
    const [new_img_id] = await Promise.all([uploadPromise, deletePromise]);
    //update user_data img_id
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        img_id: new_img_id,
      },
    });
    return res.json({ message: "Update image success" }).status(200);
  }
);


/**
 * Upload image to cloud and insert id to content data base.
 */
image_route.post(
  "/content-image",
  verifyToken,
  uploadManager,
  (...params) => checkValidImgMiddleware(...params, true, false),
  checkValidJsonMiddleware,
  async (req, res) => {
    //guarantee req.user exist from (verifyToken)
    const user = req.user as UserType;
    const file = (req.files as fileUpload.FileArray)
      .images as fileUpload.UploadedFile;
    const { err_message, parsed_data } = checkValidInput(
      [post_img_content_schema],
      [req.body]
    );
    if (err_message.error) {
      return createErrRes({ ...err_message, res });
    }
    const user_input = parsed_data[0];
    //check if portfolioData exist base on id
    const portData = await prisma.portfolioData.findFirst({
      where: { id: user_input.portfolio_data_id },
      select: { user_id: true },
    });
    if (!portData) {
      return createErrRes({
        error: "portfolio data not found",
        res,
        status_code: 404,
      });
    }
    //verify owner
    if (portData.user_id !== user.id) {
      return createErrRes({ error: "Forbidden", res, status_code: 403 });
    }
    //upload image and create save img id
    const id = await uploadImgToStorage(file);
    const imgSave = await prisma.portfolioImage.create({
      data: {
        image_id: id,
        image_name: file.name,
        image_size: file.size,
        portfolioData_id: user_input.portfolio_data_id,
        place_id: user_input.place_id,
      },
    });
    //create new content
    res.json(imgSave).status(201);
  }
);

/**
 * Upload image to cloud, remove old image and update id to content data base.
 */
image_route.patch(
  "/content-image",
  verifyToken,
  uploadManager,
  (...params) => checkValidImgMiddleware(...params, true, false),
  checkValidJsonMiddleware,
  async (req, res) => {
    //guarantee req.user exist from (verifyToken)
    const user = req.user as UserType;
    const file = (req.files as fileUpload.FileArray)
      .images as fileUpload.UploadedFile;
    const { err_message, parsed_data } = checkValidInput(
      [patch_img_content_schema],
      [req.body]
    );
    if (err_message.error) {
      return createErrRes({ ...err_message, res });
    }
    const user_input = parsed_data[0];
    //check if portfolioData exist base on id
    const img_content_data = await prisma.portfolioImage.findFirst({
      where: { id: user_input.id },
      select: {
        image_id: true,
        portfolioData: {
          select: {
            user_id: true,
          },
        },
      },
    });
    if (!img_content_data) {
      return createErrRes({
        error: "Image data not found",
        res,
        status_code: 404,
      });
    }
    //verify owner
    if (img_content_data.portfolioData.user_id !== user.id) {
      return createErrRes({ error: "Forbidden", res, status_code: 403 });
    }
    //delete that image from storage
    const deletePromise = removeImgFromStorage(img_content_data.image_id);
    //upload new image to storage
    const uploadPromise = uploadImgToStorage(file);
    const [new_img_id] = await Promise.all([uploadPromise, deletePromise]);

    const imgSave = await prisma.portfolioImage.update({
      where: {
        id: user_input.id,
      },
      data: {
        image_id: new_img_id,
        image_name: file.name,
        image_size: file.size,
      },
    });
    res.json(imgSave).status(201);
  }
);
export default image_route;
