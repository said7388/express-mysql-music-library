import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  created_at: string;
  updated_at: string;
}
