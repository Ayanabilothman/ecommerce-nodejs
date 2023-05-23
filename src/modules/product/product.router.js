import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileValidation, fileUpload } from "../../utils/multer.js";
import endPoint from "./product.endPoint.js";
import * as productController from "./controller/product.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { Subcategory } from "../../../DB/model/subcategory.model.js";
import { Brand } from "../../../DB/model/brand.model.js";
import { ResError } from "../../utils/errorClass.js";
import * as validators from "./product.validation.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router();

const idIsValid = asyncHandler(async (req, res, next) => {
  const { category, subcategory, brand } = req.body;
  if (
    category &&
    subcategory &&
    !(await Subcategory.findOne({ _id: subcategory, category }))
  )
    return next(new ResError("Category not found!", 404));

  if (brand && !(await Brand.findById(brand)))
    return next(new ResError("Brand not found!", 404));

  return next();
});

////////////////////** Get all products **///////////////////////
router.get("/", asyncHandler(productController.getAllProducts));

////////////////////** Get all products on sale**///////////////////////
router.get("/sale", asyncHandler(productController.getAllProductsOnSale));

////////////////////** Search products by name **///////////////////////
router.get("/search", asyncHandler(productController.searchProducts));

////////////////////** Add product **///////////////////////
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.addProduct),
  fileUpload(fileValidation.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  validation(validators.addProduct),
  idIsValid,
  asyncHandler(productController.addProduct)
);

////////////////////** Update product **///////////////////////
router.patch(
  "/:productId",
  isAuthenticated,
  isAuthorized(endPoint.updateProduct),
  validation(validators.updateProduct),
  idIsValid,
  asyncHandler(productController.updateProduct)
);

////////////////////** Update product default image **///////////////////////
router.patch(
  "/defaultImage/:productId",
  isAuthenticated,
  isAuthorized(endPoint.updateProduct),
  idIsValid,
  fileUpload(fileValidation.image).single("defaultImage"),
  asyncHandler(productController.updateDefaultImage)
);

////////////////////** Delete product subimage **///////////////////////
////////////////////** Add product subimage **///////////////////////

export default router;
