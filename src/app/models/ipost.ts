// models/ipost.ts
import { IUserData } from "./iuser-data";

export interface IPost {
  id_post: number;
  title: string;
  content: string;
  publication_date: string;
  forum_id: number;
  comment_count: number;
  user: IUserData; // Ahora incluimos el usuario como un objeto anidado
}
