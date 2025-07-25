import { User, Role } from '@prisma/client';

export interface IUserRepository {
  findAll(): Promise<(User & { role: Role })[]>
  findByEmail(email: string): Promise<(User & { role: Role }) | null>;
  findById(id: number): Promise<(User & { role: Role }) | null>;
  create(username: string, email: string, passwordHash: string, roleId: number): Promise<User & { role: Role }>;
  update(id: number, data: any): Promise<User & { role: Role }>; // Añadir método update
  delete(id: number): Promise<User>; // Añadir método delete
  findRoleByName(roleName: string): Promise<Role | null>;
  findRoleById(roleId: number): Promise<Role | null>; // Nuevo método
  getAllRoleNames(): Promise<string[]>;
  // createRole(roleName: string): Promise<Role>;
}