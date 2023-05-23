import multer, { diskStorage } from "multer";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  file: ["application/pdf", "application/msword"],
  video: ["video/mp4"],
};
export function fileUpload(customValidation = []) {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    return customValidation.includes(file.mimetype)
      ? cb(null, true)
      : cb("In-valid file format", false);
  };
  return multer({ fileFilter, storage });
}
