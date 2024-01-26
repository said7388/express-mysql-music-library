import { Request, Response } from "express";
import { database } from "../config/db.config";
import { Album } from "../model/album.model";

/**
 * ROUTE: /api/albums
 * METHOD: GET
 * DESC: Retrive all album list
 */
export const getAllAlbum = async (req: Request, res: Response) => {
  const connection = await database();
  const sqlQuery = `SELECT * FROM Albums`;

  try {
    const [albums] = await connection.query<Album[]>(sqlQuery);

    return res.status(200).json({
      success: true,
      albums: albums
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/albums/:id
 * METHOD: GET
 * DESC: Retrive a single album by id
 */
export const getAlbumById = async (req: Request, res: Response) => {
  const connection = await database();
  const sqlQuery = `SELECT * FROM Albums WHERE id = ?`;

  try {
    const [albums] = await connection.query<Album[]>(sqlQuery, [req.params.id]);

    if (albums.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Album not found!"
      });
    }

    return res.status(200).json({
      success: true,
      artist: albums[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/albums
 * METHOD: POST
 * DESC: Add a new album
 */
export const addNewAlbum = async (req: Request, res: Response) => {
  const { title, release_year, genre } = req.body;
  const connection = await database();
  const sqlQuery = `INSERT INTO Albums (title, release_year, genre) VALUES (?, ?, ?)`;

  try {
    await connection.query(sqlQuery, [title, release_year, genre]);

    return res.status(201).json({
      success: true,
      message: "Album added successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/albums/:id
 * METHOD: PUT
 * DESC: Update an album information
 */
export const updateAlbum = async (req: Request, res: Response) => {
  const { title, release_year, genre } = req.body;
  const connection = await database();
  const sqlQuery = `UPDATE Albums SET title = ?, release_year = ?, genre = ? WHERE id = ?`;

  try {
    await connection.query(sqlQuery, [title, release_year, genre, req.params.id]);

    return res.status(200).json({
      success: true,
      message: "Album updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/albums/:id
 * METHOD: DELETE
 * DESC: Delete an album information
 */
export const deleteAlbum = async (req: Request, res: Response) => {
  const connection = await database();
  const sqlQuery = `DELETE FROM Albums WHERE id = ?`;

  try {
    await connection.query(sqlQuery, [req.params.id]);

    return res.status(200).json({
      success: true,
      message: "Album deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};