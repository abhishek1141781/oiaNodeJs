// import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  // const { username, email, password } = req.body;
  const { phone_number, priority } = req.body;

  // before creating user check if phone no already exists, if yes throw error
  const userExists = await User.findOne({ phone_number });
  if (userExists)
    return next(errorHandler(404, "Duplicate SignUP. User exists already!!!"));

  const newUser = new User({ phone_number, priority });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { phone_number } = req.body;

  try {
    const validUserDetail = await User.findOne({ phone_number });
    if (!validUserDetail) return next(errorHandler(404, "User not found!!!"));

    const token = jwt.sign(
      { id: validUserDetail._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send the response
    res
      // httpOnly: true => cookie is inaccessible to JavaScript running in the browser. It can only be accessed by the web server
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(validUserDetail);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("user has been logged out");
  } catch (error) {
    next(error);
  }
};
