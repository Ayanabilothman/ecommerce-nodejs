import { roles } from "../../middleware/authorization.middleware.js";

export const endPoint = {
  createCoupon: [roles.Admin],
  updateCoupon: [roles.Admin],
  deleteCoupon: [roles.Admin],
};
