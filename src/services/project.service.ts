import prisma from '../config/prisma.js';
// Importamos el tipo 'Project' directamente de @prisma/client
// Ya no necesitamos importar IProject desde interfaces, ya que usaremos el tipo de Prisma
import { Project } from '@prisma/client';
import { IProjectCreateDTO, IProjectUpdateDTO } from '../interfaces/IProject.js';

export class ProjectService {
  /**
   * Creates a new project.
   * @param projectData Data for the new project.
   * @returns The created project.
   */
  static async createProject(projectData: IProjectCreateDTO): Promise<Project> {
    try {
      const project = await prisma.project.create({
        data: {
          name: projectData.name,
          description: projectData.description,
          startDate: projectData.startDate || new Date(),
          endDate: projectData.endDate,
          status: projectData.status || 'Pending',
          createdById: projectData.createdById,
        },
      });
      return project; // Este retorno ahora coincide con el tipo 'Project' de Prisma
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        throw new Error(`Project with name '${projectData.name}' already exists.`);
      }
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  /**
   * Retrieves a project by its ID.
   * @param id The project ID.
   * @returns The project, or null if not found.
   */
  static async getProjectById(id: number): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
    });
  }

  /**
   * Retrieves all projects, optionally filtered by user ID.
   * @param createdById Optional user ID to filter projects by.
   * @returns An array of projects.
   */
  static async getAllProjects(createdById?: number): Promise<Project[]> {
    const whereClause = createdById ? { createdById } : {};
    return prisma.project.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Updates an existing project.
   * @param id The project ID to update.
   * @param projectData Data to update.
   * @returns The updated project.
   */
  static async updateProject(id: number, projectData: IProjectUpdateDTO): Promise<Project> {
    try {
      const project = await prisma.project.update({
        where: { id },
        data: projectData,
      });
      return project;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Project not found.');
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        throw new Error(`Project with name '${projectData.name}' already exists.`);
      }
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  /**
   * Deletes a project by its ID.
   * @param id The project ID to delete.
   * @returns The deleted project.
   */
  static async deleteProject(id: number): Promise<Project> {
    try {
      const project = await prisma.project.delete({
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