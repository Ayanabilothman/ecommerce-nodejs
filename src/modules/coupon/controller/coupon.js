import { Coupon } from "../../../../DB/model/coupon.model.js";
import { ResError } from "../../../utils/errorClass.js";
import voucher_codes from "voucher-code-generator";

//////////////////**Get coupons**//////////////////
export const getAllCoupons = async (req, res, next) => {
  const coupon = await Coupon.find({}).populate([
    {
      path: "createdBy",
      select: "userName image.url",
    },
  ]);
  return res
    .status(200)
    .json({ success: true, message: "Done", results: { coupon } });
};

//////////////////**Add coupon**//////////////////
export const createCoupon = async (req, res, next) => {
  const code = voucher_codes.generate({
    length: 5,
  }); // ['fee33']

  const coupon = await Coupon.create({
    createdBy: req.user.id,
    name: code[0],
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(), // 12/6/2023
  });

  return res
    .status(201)
    .json({ success: true, message: "coupon created!", results: { coupon } });
};

//////////////////**Update coupon**//////////////////
export const updateCoupon = async (req, res, next) => {
  const coupon = await Coupon.findOneAndUpdate(
    {
      name: req.params.name,
      createdBy: req.user.id,
      expiredAt: { $gt: Date.now() },
    },
    {
      ...req.body,
    },
    { new: true }
  );
  if (!coupon) return next(new ResError("In-valid coupon!", 400));

  return res
    .status(200)
    .json({ success: true, message: "coupon updated!", results: { coupon } });
};
