import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { database } from "../config/db.config";
import { User } from '../model/user.model';
import { loginSchema } from '../schema';

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
    const connection = await database();
    const insertQuery = `INSERT INTO Users (name, email, password, address) VALUES (?, ?, ?, ?);`;
    const getQuery = `SELECT *, NULL AS password FROM Users WHERE id= LAST_INSERT_ID();`;

    await connection.query(insertQuery, [name, email, hashedPassword, address]);

    const [users] = await connection.query<User[]>(getQuery);

    if (users.length > 0) {
      const token = jwt.sign(
        { id: users[0].id, email: users[0].email },
        process.env.JWT_SECRTE as string,
        { expiresIn: "24h" }
      );

      return res.status(201).json({
        success: true,
        message: "User registration successfully!",
        user: users[0],
        token: token
      });
    }

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
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }

  try {
    const connection = await database();
    const sqlQuery = `SELECT * FROM Users WHERE email = ?;`;
    const [users] = await connection.query<User[]>(sqlQuery, [email]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    };

    const isPasswordValid = bcrypt.compareSync(password, users[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!",
      });
    };

    const token = jwt.sign(
      { id: users[0].id, email: users[0].email },
      process.env.JWT_SECRTE as string,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "User login successfully!",
      token: token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};