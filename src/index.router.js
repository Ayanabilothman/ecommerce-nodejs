import authRouter from "./modules/auth/auth.router.js";
import brandRouter from "./modules/brand/brand.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import categoryRouter from "./modules/category/category.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import orderRouter from "./modules/order/order.router.js";
import productRouter from "./modules/product/product.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import { connectDB } from "../DB/connection.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import cors from "cors";
const config = process.env;

export const initApp = (app, express) => {
  // Parsing buffer data to json object

  app.use(express.json({}));

  // Allow CORS
  app.use(cors());

  // Application routes
  app.use(`${config.BASE_URL}/auth`, authRouter);
  app.use(`${config.BASE_URL}/product`, productRouter);
  app.use(`${config.BASE_URL}/category`, categoryRouter);
  app.use(`${config.BASE_URL}/subCategory`, subcategoryRouter);
  app.use(`${config.BASE_URL}/coupon`, couponRouter);
  app.use(`${config.BASE_URL}/cart`, cartRouter);
  app.use(`${config.BASE_URL}/order`, orderRouter);
  app.use(`${config.BASE_URL}/brand`, brandRouter);

  app.all("*", (req, res, next) => {
    res.send("invalid route!");
  });

  app.use(globalErrorHandling);

  // Connect database
  connectDB();
};
