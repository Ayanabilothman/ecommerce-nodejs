import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./../../config/.env") });

export const sendEmail = async ({
  to = "",
  subject = "",
  html,
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Ecommerce App " <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  });

  return info.accepted.length ? true : false;
};
