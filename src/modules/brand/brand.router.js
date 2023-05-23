import * as brandController from "./controller/brand.js";
import * as validators from "./brand.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { endPoint } from "./brand.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router();

//////////////////**Get all brands**//////////////////
router.get("/", asyncHandler(brandController.getBrand));

//////////////////**Add brand**//////////////////
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.createBrand),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.createBrand),
  asyncHandler(brandController.createBrand)
);

//////////////////**Update brand**//////////////////
router.put(
  "/:brandId",
  isAuthenticated,
  isAuthorized(endPoint.updateBrand),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateBrand),
  asyncHandler(brandController.updateBrand)
);

export default router;
