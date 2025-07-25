import { PrismaClient, User, Role } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IUserRepository } from '../interfaces/IUserRepository.js';
import { TYPES } from '../../config/types.js'; // Importar los tipos/símbolos

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {} // Inyectamos PrismaClient

  async findAll(): Promise<(User & { role: Role })[]> {
    return await this.prisma.user.findMany({
      include: { role: true },
    })
  }

  async findByEmail(email: string): Promise<(User & { role: Role }) | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: number): Promise<(User & { role: Role }) | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async create(username: string, email: string, passwordHash: string, roleId: number): Promise<User & { role: Role }> {
    return await this.prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        role: {
          connect: { id: roleId },
        },
      },
      include: { role: true },
    });
  }

  async update(id: number, data: any): Promise<User & { role: Role }> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findRoleByName(roleName: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({ where: { name: roleName } });
  }

  async findRoleById(roleId: number): Promise<Role | null> {
    return this.prisma.role.findUnique({ where: { id: roleId } });
  }

  async getAllRoleNames(): Promise<string[]> {
    const roles = await this.prisma.role.findMany({
      select: { name: true },
    });
    return roles.map(role => role.name);
  }

  // async createRole(roleName: string): Promise<Role> {
  //   return await this.prisma.role.create({ data: { name: roleName } });
  // }
}