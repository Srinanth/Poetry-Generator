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

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  let token;

  // ✅ Try to get token from header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // ❗ Else fallback to cookie
  if (!token && req.signedCookies[COOKIE_NAME]) {
    token = req.signedCookies[COOKIE_NAME];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.locals.jwtData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", cause: error.message });
  }
};
