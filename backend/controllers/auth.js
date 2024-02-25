 

import mongoose from "mongoose";
import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {createError} from "../error.js";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({...req.body, password: hash});

    // await newUser.save();
    try {
      await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        console.log(`User with name :  ${req.body.name}  already exists`);
        // res.send('Create a unique user please')
      } else {
        console.log(error);
      }
    }

    res.status(200).send("user has been created");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({name: req.body.name});
    if (!user) return next(createError(404, "User not found"));
    
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "User not found!!"));
    const token = jwt.sign({id: user._id}, "dsfke");

    const {password, ...others} = user._doc;
    res.cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    //Error handling
    next(error);
  }
};
