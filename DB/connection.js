import mongoose from "mongoose";
export const connectDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION_STRING)
    .then((_) => console.log(`DB connected!`))
    .catch((error) => console.log(`Failed to connect DB: ${error} !`));
};
