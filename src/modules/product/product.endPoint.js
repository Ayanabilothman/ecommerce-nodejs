import { roles } from "../../middleware/authorization.middleware.js";

const endPoint = {
  addProduct: [roles.Admin],
  updateProduct: [roles.Admin],
};

export default endPoint;
