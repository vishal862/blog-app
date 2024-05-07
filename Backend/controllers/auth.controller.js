import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (
      !username ||
      !password ||
      !email ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      next(errorHandler(400, "All Fields are required!"));
    }

    const existedUser = await User.findOne({ username, email });

    if (existedUser) {
      next(errorHandler(400, "User Exists!"));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "user created successfully", user });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "email or password is missing"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "user not found"));
    }

    const hashRemovedPassword = bcryptjs.compareSync(
      password,
      validUser.password
    );

    if (!hashRemovedPassword) {
      return next(errorHandler(400, "Wrong Password!"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    //This is using object destructuring and the rest/spread operator. It's extracting the password property from the validUser._doc object and assigning it to a variable named pass. The rest of the properties of validUser._doc (excluding password) are collected into a new object named rest.

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { name, email, photoURL } = req.body;

  try {
    const user = await User.findOne({ email });

    console.log(user);

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
        })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword,10);

      const newUser = await User.create({
        username : name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password : hashedPassword,
        profilePicture : photoURL
      })

      const token = jwt.sign({id : newUser._id},process.env.JWT_SECRET)

      const {password , ...rest} = newUser._doc

      res.status(200)
      .cookie("access_token",token,{
        httpOnly : true,
        secure : true
      }).json(rest)

    }
  } catch (error) {
    next(error);
  }
};
