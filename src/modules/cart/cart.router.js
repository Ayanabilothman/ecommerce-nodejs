import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { endPoint } from "./cart.endPoint.js";
import * as cart from "./controller/cart.js";
import * as validators from "./cart.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router();

////////////////////** Get user's cart **///////////////////////
router.get(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.get),
  asyncHandler(cart.getCart)
);

////////////////////** Add product to cart **///////////////////////
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.add),
  validation(validators.addToCart),
  asyncHandler(cart.addToCart)
);

////////////////////** Update product in cart **///////////////////////
router.patch(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.update),
  validation(validators.addToCart),
  asyncHandler(cart.updateCart)
);

////////////////////** Remove from cart **///////////////////////
router.put(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.remove),
  validation(validators.removeFromCart),
  asyncHandler(cart.removeFromCart)
);

export default router;
