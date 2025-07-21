// This can extend or be based on Prisma's generated types if desired
import { User, Role } from '@prisma/client';

export type UserWithRole = User & { role: Role };

export interface IUserData {
  id: number;
  username: string;
  email: string;
  role: string;
}