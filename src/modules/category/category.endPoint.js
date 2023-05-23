import { roles } from "../../middleware/authorization.middleware.js";

export const endPoint = {
  createCategory: [roles.Admin],
  updateCategory: [roles.Admin],
  deleteCategory: [roles.Admin],
};
