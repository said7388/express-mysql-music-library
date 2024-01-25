import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import database from "../config/db.config";

/**
 * ROUTE: /api/auth/sign-up
 * METHOD: POST
 * DESC: User sign up with secure password
 */
export const userSignUp = async (req: Request, res: Response) => {
  const { name, email, password, address } = req.body;

  // Secure password
  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
    });
  };

  try {
    const insertQuery = `INSERT INTO Users (name, email, password, address) VALUES (?, ?, ?, ?);`;
    const getQuery = `SELECT *, NULL AS password FROM Users WHERE id= LAST_INSERT_ID();`;

    database.query(insertQuery, [name, email, hashedPassword, address], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      };
    })

    database.query(getQuery, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      };

      const token = jwt.sign(
        { id: result[0]?.id, email: result[0]?.email },
        process.env.JWT_SECRTE as string,
        { expiresIn: "24h" }
      );

      return res.status(201).json({
        success: true,
        message: "User registration successfully!",
        user: result[0],
        token: token
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/auth/login
 * METHOD: POST
 * DESC: User login with email and password
 */
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const sqlQuery = `SELECT * FROM Users WHERE email = ?;`;

  try {
    database.query(sqlQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      };

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      };

      const isPasswordValid = bcrypt.compareSync(password, result[0].password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password!",
        });
      };

      const token = jwt.sign(
        { id: result[0].id, email: result[0].email },
        process.env.JWT_SECRTE as string,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "User login successfully!",
        token: token
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};