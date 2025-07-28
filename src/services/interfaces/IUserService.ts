// src/services/interfaces/IUserService.ts
import { User, Role } from '@prisma/client';
import { IUserUpdateDTO, IUserCreateByAdminDTO } from '../../interfaces/IUser.js';

export interface IUserService {
  getAllUsers(): Promise<(User & { role: Role })[]>;
  getUserById(id: number, currentUserId: number | undefined, currentUserRole: string | undefined): Promise<(User & { role: Role }) | null>;
  updateUser(id: number, userData: IUserUpdateDTO, currentUserId: number, currentUserRole: string): Promise<User & { role: Role }>;
  deleteUser(id: number, currentUserId: number, currentUserRole: string): Promise<User>;
  // Posiblemente crear usuarios por admin, o cambiar roles
  // changeUserRole(id: number, newRoleName: string): Promise<User>;
  createUserByAdmin(userData: IUserCreateByAdminDTO, currentUserId: number, currentUserRole: string): Promise<User & { role: Role }>;
}