import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";
import dotenv from "dotenv";
import jwt, { SignOptions } from "jsonwebtoken";
import { signupSchema } from "../../models/UserValidation";

const generateToken = (id: string, username: string, admin: boolean) => {
  const token = jwt.sign(
    { userid: id, username, admin },
    process.env.JWT_SK as string,
    {
      expiresIn: process.env.JWT_expiresIn as SignOptions["expiresIn"],
    }
  );
  return token;
};
dotenv.config();
const SALT = 10;

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const { username, password, admin } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(400).json({ message: "username already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, SALT);
    const newUser = await User.create({ username, password: hashedPassword });
    const token = generateToken(String(newUser._id), username, admin);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(400).json({ message: "Invalid Username or passworn" });
    }
    const isPassValid = await bcrypt.compare(password, existingUser?.password!);

    const adminUsers = ["Azizi", "Aziz", "Fatma", "Aziz12"];

    if (isPassValid) {
      if (
        adminUsers.includes(existingUser?.username!) &&
        !existingUser?.admin
      ) {
        await User.updateOne({ _id: existingUser?._id! }, { admin: true });
        existingUser!.admin = true;
      }
      const token = generateToken(
        String(existingUser?._id),
        existingUser?.username!,
        existingUser?.admin!
      );

      res.json(token);
    } else {
      res.status(400).json("Invalid Username or passworn");
    }
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};

//passport.js there are manylibraries to teach me many ways like we can get the email and check with it i think i need to check :>
