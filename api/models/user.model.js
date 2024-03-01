import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone_number: {
      type: Number,
      required: true,
      unique: true,
    },
    priority: {
      type: Number,
      enum: [0, 1, 2], // 0 - low
      required: true,
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
