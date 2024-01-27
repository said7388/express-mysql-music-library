import { Request, Response } from "express";
import { database } from "../config/db.config";
import { Artist } from "../model/artist.model";

/**
 * ROUTE: /api/artists
 * METHOD: GET
 * DESC: Retrive all artist list
 */
export const getAllArtist = async (req: Request, res: Response) => {
  const connection = await database();
  const sqlQuery = `SELECT * FROM Artists`;

  try {
    const [artists] = await connection.query<Artist[]>(sqlQuery);

    return res.status(200).json({
      success: true,
      artists: artists
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/artists/:id
 * METHOD: GET
 * DESC: Retrive a single artist by id
 */
export const getArtistById = async (req: Request, res: Response) => {
  const connection = await database();
  const sqlQuery = `SELECT * FROM Artists WHERE id = ?`;

  try {
    const [artists] = await connection.query<Artist[]>(sqlQuery, [req.params.id]);

    if (artists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artist not found!"
      });
    }

    return res.status(200).json({
      success: true,
      artist: artists[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/artists
 * METHOD: POST
 * DESC: Add a new artist
 */
export const addNewArtist = async (req: Request, res: Response) => {
  const { name, country, albums } = req.body;
  const connection = await database();
  const sqlQuery = `INSERT INTO Artists (name, country) VALUES (?, ?)`;
  const getQuery = `SELECT * FROM Artists WHERE id= LAST_INSERT_ID();`;

  try {
    await connection.query(sqlQuery, [name, country]);
    const [artists] = await connection.query<Artist[]>(getQuery);

    if (albums?.length > 0) {
      const sqlQuery = `INSERT INTO albums_artists (artist, album) VALUES ?`;
      const values = albums.map((album: number) => [artists[0].id, album]);
      await connection.query(sqlQuery, [values]);
    };

    return res.status(201).json({
      success: true,
      message: "Artist added successfully!",
      data: artists[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/artists/:id
 * METHOD: PUT
 * DESC: Update an artist information
 */
export const updateArtist = async (req: Request, res: Response) => {
  const { name, country } = req.body;
  const connection = await database();
  const sqlQuery = `UPDATE Artists SET name = ?, country = ? WHERE id = ?`;

  try {
    await connection.query(sqlQuery, [name, country, req.params.id]);

    return res.status(200).json({
      success: true,
      message: "Artist updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/artists/:id
 * METHOD: DELETE
 * DESC: Delete an artist information
 */
export const deleteArtist = async (req: Request, res: Response) => {
  const connection = await database();
  const sqlQuery = `DELETE FROM Artists WHERE id = ?`;

  try {
    await connection.query(sqlQuery, [req.params.id]);

    return res.status(200).json({
      success: true,
      message: "Artist deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};