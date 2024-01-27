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
 * ROUTE: /api/albums/artist/:id
 * METHOD: GET
 * DESC: Get all albums by artist id
 */
export const getAlbumsByArtist = async (req: Request, res: Response) => {
  const connection = await database();
  const sqlQuery = `
    SELECT a.*
    FROM Albums a
    INNER JOIN albums_artists aa ON a.id = aa.album
    WHERE aa.artist = ?;
  `;

  try {
    const [albums] = await connection.query<Album[]>(sqlQuery, [req.params.id]);

    return res.status(200).json({
      success: true,
      albums: albums
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  };
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
  const { title, release_year, genre, artists } = req.body;

  if (!title || !release_year || !genre) {
    return res.status(400).json({
      success: false,
      message: "Title, release_year and genre are required!"
    });
  }

  try {
    const connection = await database();
    const sqlQuery = `INSERT INTO Albums (title, release_year, genre) VALUES (?, ?, ?)`;
    const getQuery = `SELECT * FROM Albums WHERE id= LAST_INSERT_ID();`;

    await connection.query(sqlQuery, [title, release_year, genre]);
    const [albums] = await connection.query<Album[]>(getQuery);

    if (artists?.length > 0) {
      const sqlQuery = `INSERT INTO albums_artists (album, artist) VALUES ?`;
      const values = artists.map((artist: number) => [albums[0].id, artist]);
      await connection.query(sqlQuery, [values]);
    }

    return res.status(201).json({
      success: true,
      message: "Album added successfully!",
      data: albums[0]
    });
  } catch (error) {
    console.log(error)
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

  if (!title || !release_year || !genre) {
    return res.status(400).json({
      success: false,
      message: "Title, release_year and genre are required!"
    });
  };

  try {
    const connection = await database();
    const sqlQuery = `UPDATE Albums SET title = ?, release_year = ?, genre = ? WHERE id = ?`;

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