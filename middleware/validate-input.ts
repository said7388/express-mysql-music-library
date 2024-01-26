import { NextFunction, Request, Response } from "express";
import { database } from "../config/db.config";
import { User } from "../model/user.model";

export const validateInput = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required!",
    });
  };

  const sqlQuery = `SELECT * FROM Users WHERE email = '${email}';`;
  const connection = await database();

  try {
    const [users] = await connection.query<User[]>(sqlQuery);

    if (users.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists with the email!",
      });
    }
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};