import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./auth.validation.js";
import * as authController from "./Controller/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router();

////////////////////////////////// Registeration //////////////////////////////////
router.post(
  "/register",
  validation(validators.signupSchema),
  asyncHandler(authController.register)
);

////////////////////////////////// Activate Account //////////////////////////////////
router.get(
  "/confirmEmail/:activationCode",
  validation(validators.activateCode),
  asyncHandler(authController.activateAcc)
);

////////////////////////////////// Login //////////////////////////////////
router.post(
  "/login",
  validation(validators.loginSchema),
  asyncHandler(authController.login)
);

//////////////// Send forget password code ////////////////
router.patch(
  "/forgetCode",
  validation(validators.sendForgetCode),
  asyncHandler(authController.sendForgetCode)
);

//////////////// Reset password ////////////////
router.patch(
  "/resetPassword",
  validation(validators.resetPassword),
  asyncHandler(authController.resetPassword)
);

export default router;
