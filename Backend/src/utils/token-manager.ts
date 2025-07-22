import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import dotenv from "dotenv";
dotenv.config();

interface DecodedToken extends JwtPayload {
  id: string; 
  email: string; 
  iat?: number; 
  exp?: number;
}

export const createToken = (id: string, email: string, expiresIn) => {
  const payload = { id, email }; // Include the required fields
  const token = jwt.sign(payload, process.env.JWT, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1. Try to get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fallback: Try to get token from signed cookies
    if (!token) {
      token = req.signedCookies[COOKIE_NAME];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT) as DecodedToken;

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    res.locals.jwtData = { id: decoded.id, email: decoded.email };
    next();

  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

