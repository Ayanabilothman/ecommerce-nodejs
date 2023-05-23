import { Brand } from "../../../../DB/model/brand.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ResError } from "../../../utils/errorClass.js";

//////////////////**Get all brands**//////////////////
export const getBrand = async (req, res, next) => {
  const brand = await Brand.find({}).populate([
    {
      path: "createdBy",
      select: "userName image.url",
    },
  ]);
  return res
    .status(200)
    .json({ success: true, message: "Done", results: { brand } });
};

//////////////////**Add brand**//////////////////
export const createBrand = async (req, res, next) => {
  // upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/Brand`,
    }
  );

  // create brand
  const brand = await Brand.create({
    createdBy: req.user.id,
    name: req.body.name,
    "image.url": secure_url,
    "image.id": public_id,
  });

  return res.status(201).json({
    success: true,
    message: "brand created!",
    results: { brand },
  });
};

//////////////////**Update brand**//////////////////
export const updateBrand = async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new ResError("In-valid brand id", 400));

  brand.name = req.body.name ? req.body.name : brand.name;

  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: brand.image.id,
    });
    brand.image.url = secure_url;
  }

  await brand.save();

  return res.status(200).json({
    success: true,
    message: "brand updated!",
    results: { brand },
  });
};
