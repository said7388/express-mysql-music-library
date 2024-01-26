import { RowDataPacket } from "mysql2";

export interface Artist extends RowDataPacket {
  id: number;
  name: string;
  country: string;
  created_at: string;
  updated_at: string;
}
