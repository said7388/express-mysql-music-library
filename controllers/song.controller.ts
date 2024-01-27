import { Request, Response } from "express";
import { database } from "../config/db.config";
import { Song } from "../model/song.model";
import { songSchema } from "../schema";

/**
 * ROUTE: /api/songs
 * METHOD: GET
 * DESC: Retrive all songs
 */
export const getAllSong = async (req: Request, res: Response) => {
  const connection = await database();
  const sqlQuery = `SELECT * FROM Songs`;

  try {
    const [songs] = await connection.query<Song[]>(sqlQuery);

    return res.status(200).json({
      success: true,
      songs: songs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/songs/album/:id
 * METHOD: GET
 * DESC: Retrive all songs for an album
 */
export const getSongsForAlbum = async (req: Request, res: Response) => {
  const connection = await database();
  const { id } = req.params;

  const sqlQuery = `
            SELECT s.id, s.title, s.duration, s.title as album_name
            FROM Songs s
            JOIN Albums a ON a.id = s.album
            WHERE s.album = ${id}; 
    `;

  try {
    const [songs] = await connection.query<Song[]>(sqlQuery);

    return res.status(200).json({
      success: true,
      songs: songs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
}

/**
 * ROUTE: /api/songs/:id
 * METHOD: GET
 * DESC: Retrive a song details by id
 */
export const getSongById = async (req: Request, res: Response) => {
  const connection = await database();
  const { id } = req.params;
  const sqlQuery = `
            SELECT s.id, s.title, s.duration, s.title as album_name
            FROM Songs s
            JOIN Albums a ON a.id = s.album
            WHERE s.id = ${id}; 
    `;

  try {
    const [songs] = await connection.query<Song[]>(sqlQuery);

    return res.status(200).json({
      success: true,
      songs: songs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/songs
 * METHOD: POST
 * DESC: Add a new song
 */
export const addNewSong = async (req: Request, res: Response) => {
  const { title, duration, album } = req.body;
  const { error } = songSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  try {
    const connection = await database();
    const sqlQuery = `INSERT INTO Songs (title, duration, album) VALUES (?, ?, ?)`;

    await connection.query<Song[]>(sqlQuery, [title, duration, album]);

    return res.status(200).json({
      success: true,
      message: "Song added successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/songs/:id
 * METHOD: PUT
 * DESC: Update a song
 */
export const updateSong = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, duration, album } = req.body;
  const { error } = songSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  };

  try {
    const connection = await database();
    const sqlQuery = `UPDATE Songs SET title = ?, duration = ?, album = ? WHERE id = ?`;

    await connection.query<Song[]>(sqlQuery, [title, duration, album, id]);

    return res.status(200).json({
      success: true,
      message: "Song updated successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }
};

/**
 * ROUTE: /api/songs/:id
 * METHOD: DELETE
 * DESC: Delete a song
 */
export const deleteSong = async (req: Request, res: Response) => {
  const connection = await database();
  const { id } = req.params;
  const sqlQuery = `DELETE FROM Songs WHERE id = ?`;

  try {
    await connection.query<Song[]>(sqlQuery, [id]);

    return res.status(200).json({
      success: true,
      message: "Song deleted successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  };
};