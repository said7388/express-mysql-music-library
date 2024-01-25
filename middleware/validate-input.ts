import { NextFunction, Request, Response } from "express";
import database from "../config/db.config";

export const validateInput = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required!",
    });
  };

  const sqlQuery = `SELECT * FROM Users WHERE email = ?;`;

  try {
    database.query(sqlQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      };

      if (result[0]) {
        return res.status(400).json({
          success: false,
          message: "User already exists with the email!",
        });
      }
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};