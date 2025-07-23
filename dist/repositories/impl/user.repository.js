var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { PrismaClient } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
// Importamos el token de Prisma del nuevo archivo tokens.ts
import { PRISMA_CLIENT } from '../../config/tokens.js';
// import { PRISMA_CLIENT } from '../../config/container.js'; // Importamos el token de Prisma
let UserRepository = class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    } // Inyectamos PrismaClient
    async findByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
    }
    async findById(id) {
        return await this.prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
    }
    async create(username, email, passwordHash, roleId) {
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
    async findRoleByName(roleName) {
        return await this.prisma.role.findUnique({ where: { name: roleName } });
    }
    async createRole(roleName) {
        return await this.prisma.role.create({ data: { name: roleName } });
    }
};
UserRepository = __decorate([
    injectable(),
    __param(0, inject(PRISMA_CLIENT)),
    __metadata("design:paramtypes", [PrismaClient])
], UserRepository);
export { UserRepository };
//# sourceMappingURL=user.repository.js.map