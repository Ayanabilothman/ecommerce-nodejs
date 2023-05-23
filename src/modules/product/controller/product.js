import cloudinary from "../../../utils/cloudinary.js";
import { Product } from "../../../../DB/model/product.model.js";
import { ResError } from "../../../utils/errorClass.js";
import { nanoid } from "nanoid";

////////////////////** Get all products **///////////////////////
export const getAllProducts = async (req, res, next) => {
  const query = Product.find({})
    .filter(req.query)
    .sort(req.query.sort)
    .customSelect(req.query.fields)
    .paginate(req.query.page, req.query.size);

  const products = await query;

  return res
    .status(200)
    .json({ success: true, message: "Done", results: { products } });
};

////////////////////** Get all products on sale **///////////////////////
export const getAllProductsOnSale = async (req, res, next) => {
  const products = await Product.find({ discount: { $gt: 0 } });

  return res
    .status(200)
    .json({ success: true, message: "Done", results: { products } });
};

////////////////////** Search product by name **///////////////////////
export const searchProducts = async (req, res, next) => {
  const products = await Product.find({
    name: { $regex: req.query.name, $options: "i" },
  });

  return res
    .status(200)
    .json({ success: true, message: "Done", results: { products } });
};

////////////////////** Add product **///////////////////////
export const addProduct = async (req, res, next) => {
  /*
  const {
    name,
    description,
    availableItems,
    price,
    discount,
    category,
    subcategory,
    brand,
  } = req.body;
  */

  const cloudFolder = nanoid();
  const images = [];

  // upload sub images
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.APP_NAME}/products/${cloudFolder}` }
    );
    images.push({ url: secure_url, id: public_id });
  }

  // upload default images
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.APP_NAME}/products/${cloudFolder}` }
  );

  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user.id,
    defaultImage: { url: secure_url, id: public_id },
    images,
  });

  return res
    .status(201)
    .json({ success: true, message: "product created!", results: { product } });
};

////////////////////** Update product **///////////////////////
export const updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.productId);
  if (!product) return next(new ResError("Product not found!", 404));

  /*
  const {
    name,
    description,
    availableItems,
    price,
    discount,
    category,
    subcategory,
    brand,
  } = req.body;
  */

  product = await Product.findByIdAndUpdate(
    product._id,
    {
      ...req.body,
    },
    { new: true }
  );

  return res
    .status(200)
    .json({ success: true, message: "Product updated!", results: { product } });
};

////////////////////** Update product default image **///////////////////////
export const updateDefaultImage = async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new ResError("Product not found!", 404));

  // replace default image
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    public_id: product.defaultImage.id,
  });

  product.defaultImage.url = secure_url;
  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product image updated!",
    results: { product },
  });
};
