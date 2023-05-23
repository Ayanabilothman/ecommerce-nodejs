import { roles } from "../../middleware/authorization.middleware.js";

export const endPoint = {
  createBrand: [roles.Admin],
  updateBrand: [roles.Admin],
  deleteBrand: [roles.Admin],
};
