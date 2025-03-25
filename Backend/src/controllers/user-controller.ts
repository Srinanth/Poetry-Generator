import User from "../models/user.js";
import { Request, Response,NextFunction } from "express";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get all users
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //sign up
    const { name, email, password } = req.body;
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return res.status(401).send("User already exists");
    }
    const hashed = await hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
// creating tokens and storing cookies,same for login
    res.clearCookie(COOKIE_NAME, {
      domain:"poetry-generator-3q8c.onrender.com",
      secure: true, // Ensure cookies are sent over HTTPS
  sameSite: "none",
      httpOnly: true,
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      secure: true, // Ensure cookies are sent over HTTPS
  sameSite: "none", 
      expires,
      httpOnly: true,
      signed: true,
      domain:"poetry-generator-3q8c.onrender.com",
    });


    return res.status(201).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userlogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //login
    const {email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User does not exist");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Password is incorrect");
    }
    
    res.clearCookie(COOKIE_NAME, {
      secure: true, // Ensure cookies are sent over HTTPS
  sameSite: "none", 
      httpOnly: true,
      signed: true,
      path: "/",
      domain:"poetry-generator-3q8c.onrender.com",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      secure: true, // Ensure cookies are sent over HTTPS
  sameSite: "none", 
      expires,
      httpOnly: true,
      signed: true,
      domain:"poetry-generator-3q8c.onrender.com",
    });

    return res.status(200).json({ message: "OK", name: user.name, email: user.email,token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      
      return res.status(401).json({ message: "User does not exist or token malfunction" });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Permissions didn't match" });
    }

    // Return user data if authenticated
    return res.status(200).json({ message: "OK", email: user.email });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "poetry-generator-3q8c.onrender.com", // Remove https://
      secure: true,
      sameSite: "none",
      httpOnly: true,
      signed: true,
    });
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
// for implementing a userprofile feature
export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
