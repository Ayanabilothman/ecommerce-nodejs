import { roles } from "../../middleware/authorization.middleware.js";

const endPoint = {
  createOrder: [roles.Admin, roles.User],
  updateOrder: [roles.Admin, roles.User],
  cancelOrder: [roles.User],
  userOrders: [roles.User],
  chechOut: [roles.User],
};

export default endPoint;
