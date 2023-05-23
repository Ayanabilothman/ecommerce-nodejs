import * as couponController from "./controller/coupon.js";
import * as validators from "./coupon.validation.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { Router } from "express";
import { endPoint } from "./coupon.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";

const router = Router();

//////////////////**Get coupons**//////////////////
router.get("/", asyncHandler(couponController.getAllCoupons));

//////////////////**Add coupon**//////////////////
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.createCoupon),
  validation(validators.createCoupon),
  asyncHandler(couponController.createCoupon)
);

//////////////////**Update coupon**//////////////////
router.put(
  "/:name",
  isAuthenticated,
  isAuthorized(endPoint.updateCoupon),
  validation(validators.updateCoupon),
  asyncHandler(couponController.updateCoupon)
);

export default router;
