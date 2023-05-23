import { Cart } from "../../../../DB/model/cart.model.js";
import { Order } from "../../../../DB/model/order.model.js";
import { Product } from "../../../../DB/model/product.model.js";
import { ResError } from "../../../utils/errorClass.js";
import { createInvoice } from "../../../utils/invoicepdf.js";
import { Coupon } from "./../../../../DB/model/coupon.model.js";
import { updateStock, clearCart } from "./../order.service.js";
import { User } from "./../../../../DB/model/user.model.js";
import { unlink } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../../../utils/cloudinary.js";
import { sendEmail } from "./../../../utils/email.js";
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

////////////////////** Get all orders **///////////////////////
export const getAllOrders = async (req, res, next) => {
  const orders = await Order.find({}).populate([
    {
      path: "user",
      select: "userName image.url",
    },
    {
      path: "products.productId",
    },
  ]);
  return res
    .status(200)
    .json({ sucess: true, message: "Done", results: { orders } });
};

////////////////////** Get user orders **///////////////////////
export const userOrders = async (req, res, next) => {
  const orders = await Order.find({
    user: req.user.id,
  }).populate([
    {
      path: "products.productId",
      select: "name defaultImage.url",
    },
  ]);
  return res
    .status(200)
    .json({ sucess: true, message: "Done", result: { orders } });
};

////////////////////** Create order **///////////////////////
export const createOrder = async (req, res, next) => {
  const { address, phone, payment, coupon } = req.body;

  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });

    if (!checkCoupon) return next(new ResError(`In-valid coupon! `, 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  const products = cart.products;
  if (products.length < 1) return next(new ResError(`Cart is empty! `, 400));

  let orderProducts = [];
  let orderPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(products[i].productId);

    if (!product) return next(new ResError(`${product.name} not found! `, 400));

    if (!product.inStock(products[i].quantity))
      return next(
        new ResError(
          `Product ${product.name} out of stock, only ${product.availableItems} items left!`,
          400
        )
      );

    orderProducts.push({
      productId: product._id,
      name: product.name,
      quantity: products[i].quantity,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
    });

    orderPrice += product.finalPrice * products[i].quantity;
  }

  const order = await Order.create({
    user: req.user.id,
    products: orderProducts,
    price: orderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
    address,
    phone,
    payment,
  });

  if (!order)
    return next(
      new ResError("Failed to create order, please try again later!")
    );

  updateStock(products);
  clearCart(req.user.id);

  /////////////////////////////invoice pdf///////////////////////////

  const user = await User.findById(req.user.id);
  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order.id,
  };

  const pdfPath =
    process.env.STATUS === "DEV"
      ? path.join(__dirname, `./../../../tempPDF/${order._id}.pdf`)
      : `/tmp/${order._id}.pdf`;

  createInvoice(invoice, pdfPath);

  // upload invoice to cloudnairy
  const { secure_url } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.APP_NAME}/order/invoice`,
  });

  if (secure_url) {
    // save invoice in DB
    order.invoice = secure_url;
    await order.save();

    // delete file from system
    await unlink(pdfPath);

    // send email with the invoice
    sendEmail({
      to: user.email,
      subject: "Order Invoice",
      attachments: [
        {
          path: secure_url,
          contentType: "application/pdf",
        },
      ],
    });
  }

  /////////////////////////////invoice pdf///////////////////////////

  return res
    .status(201)
    .json({ success: true, message: "Done", results: { order } });
};

////////////////////** Cancel order **///////////////////////
export const cancelOrder = async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user.id,
  });

  if (!order) return next(new ResError("Order not found!", 404));

  if (order.status != "Placed")
    return next(
      new ResError(
        `Can't cancel order right now, it's already ${order.status}!`,
        400
      )
    );

  await order.remove();

  return res.status(200).json({ success: true, message: "Order cancelled!" });
};

////////////////////** Check out **///////////////////////
export const checkOut = async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user.id,
  }).populate([{ path: "user" }, { path: "products.productId" }]);

  if (!order) return next(new ResError("Order not found!", 404));

  // 4242424242...
  //05/26
  // 565
  const stripe = new Stripe(process.env.PRIVATE_KEY);
  let checkCoupon;

  if (order.coupon.name !== undefined) {
    checkCoupon = await stripe.coupons.create({
      percent_off: order.coupon.discount,
      duration: "once",
    });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.success_url_fe}`, //https://localhost:5500/Client/success.html
    cancel_url: `${process.env.cancel_url_fe}`, //https://localhost:5500/Client/cancel.html
    line_items: order.products.map((product) => {
      return {
        price_data: {
          currency: "egp",
          product_data: {
            name: product.name,
            images: [product.productId.defaultImage.url],
          },
          unit_amount: product.itemPrice * 100,
        },
        quantity: product.quantity,
      };
    }),
    ...(checkCoupon && { discounts: [{ coupon: checkCoupon.id }] }),
  });

  return res.status(200).json({
    success: true,
    message: "Done!",
    results: { url: session.url },
  });
};
