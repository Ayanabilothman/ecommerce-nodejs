import { roles } from "../../middleware/authorization.middleware.js";

export const endPoint = {
  createSubcategory: [roles.Admin],
  updateSubcategory: [roles.Admin],
  deleteSubcategory: [roles.Admin],
};
