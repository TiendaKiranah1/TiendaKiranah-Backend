const express = require("express");
const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const CustomError = require("../util/customError");
const mail = require("../util/email");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      next(new CustomError("Email already Exist", 400));
    }
    const newUser = await User.create({
      name,
      email,
      password
    });
    if (!newUser) {
      return next(new CustomError("Unable to create new User"));
    }
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN
    });
    await mail(email);
    return res.status(201).json({
      status: "Success",
      token
    });
  } catch (error) {
    return next(new CustomError(error.message, 400));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new CustomError("Please provide email and password", 401));
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new CustomError("Incorrect email or password", 401));
    }
    if (user && !(await user.comparePassword(password, user.password))) {
      return next(new CustomError("Incorrect email or password", 401));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN
    });
    res.status(200).json({
      status: "success",
      token
    });
  } catch (error) {
    return next(new CustomError(error.message, 400));
  }
};

exports.authorizedRoute = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new CustomError("You are not logged in! Please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new CustomError("The user belonging to this token no longer exist.", 401)
    );
  }
  req.user = user;

  return next();
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new CustomError("There is no user with the email!", 401));
  }

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await mail(user.email, resetURL);

    return res.status(200).json({
      status: "success",
      message: "Token sent to email"
    });
  } catch (error) {
    console.log(error);
    (user.resetPasswordToken = undefined),
      (user.passwordTokenExpire = undefined),
      await user.save({ validateBeforeSave: false });
    return next(new CustomError("There is an error. Try again", 500));
  }
};
