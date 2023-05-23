import { Cart } from "../../../../DB/model/cart.model.js";
import { Product } from "../../../../DB/model/product.model.js";
import { ResError } from "../../../utils/errorClass.js";

////////////////////** Get user's cart **///////////////////////
export const getCart = async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "products.productId",
    "name price discount finalPrice defaultImage.url"
  );

  return res
    .status(200)
    .json({ success: true, message: "Done", results: { cart } });
};

////////////////////** Add product to cart **///////////////////////
export const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById({ _id: productId });
  if (!product) return next(new ResError("Product not found!", 404));

  if (!product.inStock(quantity))
    return next(
      new ResError(
        `Product out of stock, only ${product.availableItems} items left!`,
        400
      )
    );

  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { $push: { products: { productId, quantity } } },
    { new: true }
  );

  return res.status(200).json({
    sucess: true,
    message: "Product added to cart!",
    results: { cart },
  });
};

////////////////////** Update product in cart **///////////////////////
export const updateCart = async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById({ _id: productId });
  if (!product) return next(new ResError("Product not found!", 404));

  if (!product.inStock(quantity))
    return next(
      new ResError(
        `Product out of stock, only ${product.availableItems} items left!`,
        400
      )
    );

  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id, "products.productId": productId },
    {
      $set: {
        "products.$.quantity": quantity,
      },
    },
    { new: true }
  );

  return res.status(200).json({
    sucess: true,
    message: "Product added to cart!",
    results: { cart },
  });
};

////////////////////** Remove from cart **///////////////////////
export const removeFromCart = async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      $pull: {
        products: {
          productId: req.body.productId,
        },
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json({ success: true, message: "Product removed!", results: { cart } });
};
