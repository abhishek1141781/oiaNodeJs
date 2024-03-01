import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created from auth.controller.js !!!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUserDetail = await User.findOne({ email });
    if (!validUserDetail) return next(errorHandler(404, "User not found!!!"));
    const validPassword = bcryptjs.compareSync(
      password,
      validUserDetail.password
    );
    if (!validPassword) return next(errorHandler(401, "Invalid password!"));

    const token = jwt.sign(
      { id: validUserDetail._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password: pass, ...rest } = validUserDetail._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
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


export const test = async (req, res, next) => {
  try {
    console.log("Hello chal gya");
    res.status(200).json("passed");
  } catch (error) {
    next(error)
  }
}