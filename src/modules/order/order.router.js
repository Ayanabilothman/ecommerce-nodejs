import * as order from "./controller/order.js";
import * as validators from "./order.validation.js";
import endPoint from "./order.endPoint.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router();

////////////////////** Get all orders **///////////////////////
router.get("/", isAuthenticated, asyncHandler(order.getAllOrders));

////////////////////** Get user orders **///////////////////////
router.get(
  "/user",
  isAuthenticated,
  isAuthorized(endPoint.userOrders),
  asyncHandler(order.userOrders)
);

////////////////////** Create order **///////////////////////
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.createOrder),
  validation(validators.createOrder),
  asyncHandler(order.createOrder)
);

////////////////////** Cancel order **///////////////////////
router.delete(
  "/:orderId",
  isAuthenticated,
  isAuthorized(endPoint.cancelOrder),
  validation(validators.cancelOrder),
  asyncHandler(order.cancelOrder)
);

////////////////////** Check out **///////////////////////
router.post(
  "/checkout/:orderId",
  isAuthenticated,
  isAuthorized(endPoint.chechOut),
  validation(validators.checkOut),
  asyncHandler(order.checkOut)
);

export default router;
