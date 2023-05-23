import * as categoryController from "./controller/category.js";
import * as validators from "./category.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
import subcategoryRouter from "../subcategory/subcategory.router.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { endPoint } from "./category.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router();

router.use("/:categoryId/subcategory", subcategoryRouter);

//////////////////**Get all categories**//////////////////
router.get("/", asyncHandler(categoryController.getAllCategories));

//////////////////**Add category**//////////////////
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.createCategory),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.createCategory),
  asyncHandler(categoryController.createCategory)
);

//////////////////**Update category**/////////////////
router.put(
  "/:categoryId",
  isAuthenticated,
  isAuthorized(endPoint.updateCategory),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateCategory),
  asyncHandler(categoryController.updateCategory)
);

//////////////////**Delete category**/////////////////
router.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthorized(endPoint.deleteCategory),
  validation(validators.deleteCategory),
  asyncHandler(categoryController.deleteCategory)
);

export default router;
