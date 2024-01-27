import { RowDataPacket } from "mysql2";

export interface Song extends RowDataPacket {
  id: number;
  title: string;
  duration: string;
  album: number;
  created_at: string;
  updated_at: string;
};