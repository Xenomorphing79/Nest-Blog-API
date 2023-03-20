import { blogEntry } from "src/blog/models/blogEntry.interface";

export interface User {
  id?: number;
  name?: string;
  userName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  profileImage?: string;
  blogEntries?: blogEntry[];
}

export enum UserRole {
  ADMIN = 'admin',
  CHIEFEDITOR = 'chiefeditor',
  EDITOR = 'editor',
  USER = 'user',
}