import mongoose from "mongoose";

export const connectToDb = async () => {
  if (mongoose.connection.readyState === 1) return;

  return mongoose.connect(process.env.MONGO_URI!);
};

export const disconnectFromDb = async () => {
  if (mongoose.connection.readyState === 0) return;

  return mongoose.disconnect();
};
