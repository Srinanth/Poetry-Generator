import User from "../models/user.js";
import { Request, Response,NextFunction } from "express";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (res: Response) => {
  try {
    //get all users
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userSignup = async (req: Request,res: Response) => {
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
      domain: "localhost",
      httpOnly: true,
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });


    return res.status(201).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const userlogin = async (req: Request,res: Response) => {
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
      domain: "localhost",
      httpOnly: true,
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res.status(200).json({ message: "OK", name: user.name, email: user.email,token });
  } catch (error) {
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (res: Response) => {
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

export const logout = async (res: Response) => {
  try {
    // token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User does not exist or token malfunction");
    }
    console.log(user._id.toString(), res.locals.jwtData.id);

    if(user._id.toString()!== res.locals.jwtData.id){
      return res.status(401).send("Permissions didnt match");
    }

    return res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
// for implementing a userprofile feature
export const myProfile = async (req:any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
