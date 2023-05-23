import { Product } from "../../../DB/model/product.model.js";
import { Cart } from "./../../../DB/model/cart.model.js";

export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { products: [] });
};

export const updateStock = async (products) => {
  for (const product of products) {
    await Product.findByIdAndUpdate(product.productId, {
      $inc: {
        availableItems: -Number(product.quantity),
        soldItems: product.quantity,
      },
    });
  }
};
