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
// import { PRISMA_CLIENT } from '../../config/container.js';
let ProjectRepository = class ProjectRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            const project = await this.prisma.project.create({
                data: {
                    name: data.name,
                    description: data.description,
                    startDate: data.startDate || new Date(),
                    endDate: data.endDate,
                    status: data.status || 'Pending',
                    createdById: data.createdById,
                },
            });
            return project;
        }
        catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
                throw new Error(`Project with name '${data.name}' already exists.`);
            }
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }
    async findById(id) {
        return await this.prisma.project.findUnique({
            where: { id },
        });
    }
    async findAll(createdById) {
        const whereClause = createdById ? { createdById } : {};
        return await this.prisma.project.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, data) {
        try {
            const project = await this.prisma.project.update({
                where: { id },
                data,
            });
            return project;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new Error('Project not found.');
            }
            if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
                throw new Error(`Project with name '${data.name}' already exists.`);
            }
            throw new Error(`Failed to update project: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const project = await this.prisma.project.delete({
                where: { id },
            });
            return project;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new Error('Project not found.');
            }
            throw new Error(`Failed to delete project: ${error.message}`);
        }
    }
};
ProjectRepository = __decorate([
    injectable(),
    __param(0, inject(PRISMA_CLIENT)),
    __metadata("design:paramtypes", [PrismaClient])
], ProjectRepository);
export { ProjectRepository };
//# sourceMappingURL=project.repository.js.map