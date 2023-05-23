import * as subcategoryController from "./controller/subcategory.js";
import * as validators from "./subcategory.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { endPoint } from "./subcategory.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { Category } from "../../../DB/model/category.model.js";
import { parentExisted } from "../../middleware/parentExistence.middleware.js";

const router = Router({ mergeParams: true });

//////////////////**Get all subcategories**//////////////////
router.get("/", asyncHandler(subcategoryController.getAllSubcategories));

//////////////////**Add subcategory**//////////////////
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.createSubcategory),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.createSubcategory),
  parentExisted(Category, "categoryId"),
  asyncHandler(subcategoryController.createSubcategory)
);

//////////////////**Update subcategory**/////////////////
router.put(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized(endPoint.updateSubcategory),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateSubcategory),
  parentExisted(Category, "categoryId"),
  asyncHandler(subcategoryController.updateSubcategory)
);

export default router;
