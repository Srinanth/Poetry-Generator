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
    
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT) as DecodedToken;
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    
    // Attach the decoded token data to res.locals
    res.locals.jwtData = { id: decoded.id, email: decoded.email };
    next(); // Proceed to the next middleware.
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
