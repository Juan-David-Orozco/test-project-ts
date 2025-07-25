import { User, Role } from '@prisma/client';

export interface IUserRepository {
  findByEmail(email: string): Promise<(User & { role: Role }) | null>;
  findById(id: number): Promise<(User & { role: Role }) | null>;
  create(username: string, email: string, passwordHash: string, roleId: number): Promise<User & { role: Role }>;
  findRoleByName(roleName: string): Promise<Role | null>;
  getAllRoleNames(): Promise<string[]>;
  // createRole(roleName: string): Promise<Role>;
}