import { RowDataPacket } from "mysql2";

export interface Album extends RowDataPacket {
  id: number;
  title: string;
  release_year: number;
  genre: string;
  created_at: string;
  updated_at: string;
};