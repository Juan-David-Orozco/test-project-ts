import { PrismaClient, User, Role } from '@prisma/client';
// import { injectable, inject } from 'tsyringe';
import { injectable, inject } from 'inversify';
import { IUserRepository } from '../interfaces/IUserRepository.js';
import { TYPES } from '../../config/types.js'; // Importar los tipos/símbolos
// import prisma from "../../config/prisma.js";
// Importamos el token de Prisma del nuevo archivo tokens.ts
// import { PRISMA_CLIENT } from '../../config/tokens.js';
// import { PRISMA_CLIENT } from '../../config/container.js'; // Importamos el token de Prisma

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {} // Inyectamos PrismaClient
  // private prisma: PrismaClient;
  // constructor(prismaClient: PrismaClient) { this.prisma = prismaClient; }

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

  async findRoleByName(roleName: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({ where: { name: roleName } });
  }

  async createRole(roleName: string): Promise<Role> {
    return await this.prisma.role.create({ data: { name: roleName } });
  }
}