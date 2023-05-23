import { roles } from "../../middleware/authorization.middleware.js";

export const endPoint = {
  get: [roles.User, roles.Admin],
  add: [roles.User],
  update: [roles.User],
  remove: [roles.User],
};
