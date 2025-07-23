import { PrismaClient, Project } from '@prisma/client';
// import { injectable, inject } from 'tsyringe';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../config/types.js'; 
import { IProjectRepository } from '../interfaces/IProjectRepository.js';
import { IProjectCreateDTO, IProjectUpdateDTO } from '../../interfaces/IProject.js';
// import prisma from "../../config/prisma.js";
// Importamos el token de Prisma del nuevo archivo tokens.ts
// import { PRISMA_CLIENT } from '../../config/tokens.js';
// import { PRISMA_CLIENT } from '../../config/container.js';

@injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}
  // private prisma: PrismaClient;
  // constructor(prismaClient: PrismaClient) { // Acepta PrismaClient a través del constructor
  //   this.prisma = prismaClient;
  // }

  async create(data: IProjectCreateDTO): Promise<Project> {
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
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        throw new Error(`Project with name '${data.name}' already exists.`);
      }
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  async findById(id: number): Promise<Project | null> {
    return await this.prisma.project.findUnique({
      where: { id },
    });
  }

  async findAll(createdById?: number): Promise<Project[]> {
    const whereClause = createdById ? { createdById } : {};
    return await this.prisma.project.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, data: IProjectUpdateDTO): Promise<Project> {
    try {
      const project = await this.prisma.project.update({
        where: { id },
        data,
      });
      return project;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Project not found.');
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        throw new Error(`Project with name '${data.name}' already exists.`);
      }
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  async delete(id: number): Promise<Project> {
    try {
      const project = await this.prisma.project.delete({
        where: { id },
      });
      return project;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Project not found.');
      }
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }
}