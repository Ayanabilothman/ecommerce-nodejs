import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../config/.env") });

import cloudinary from "cloudinary";

cloudinary.v2.config({
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  cloud_name: process.env.cloud_name,
  secure: true,
});

export default cloudinary.v2;

export const toCloudinary = async (filePath, folder, public_id) => {
  const file = await cloudinary.uploader.upload(filePath, {
    folder,
    ...(public_id && { public_id }),
  });

  return { secure_url: file.secure_url, public_id: file.public_id };
};
