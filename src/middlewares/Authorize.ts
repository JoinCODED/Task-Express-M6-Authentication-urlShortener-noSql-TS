import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const Authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.headers.authorization);
    const header = req.headers.authorization;

    // console.log(header?.split(" "));
    const [authType, token] = header?.split(" ") || [];
    if (authType !== "Bearer" || !token) {
      res.status(403).json("Invalid Auth Type");
      return;
    }
    // now i need to verify my token & get payload
    const payload = jwt.verify(token, process.env.JWT_SK as string);
    console.log(payload);
    //last step is Attach the payload to the request
    (req as any).user = payload;
    if ((req as any).user.admin === true) {
      next();
    } else {
      res.status(403).json("Not Authorized");
    }
  } catch (error) {
    next(error);
  }
};
