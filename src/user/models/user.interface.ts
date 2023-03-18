export interface User {
  id?: number;
  name?: string;
  userName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  CHIEFEDITOR = 'chiefeditor',
  EDITOR = 'editor',
  USER = 'user',
}