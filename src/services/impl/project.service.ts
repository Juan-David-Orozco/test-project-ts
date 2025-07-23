// Importamos el tipo 'Project' directamente de @prisma/client
// Ya no necesitamos importar IProject desde interfaces, ya que usaremos el tipo de Prisma
import { injectable, inject } from 'tsyringe';
import { Project } from '@prisma/client';
import { IProjectService } from '../interfaces/IProjectService.js';
import { IProjectRepository } from '../../repositories/interfaces/IProjectRepository.js';
import { IProjectCreateDTO, IProjectUpdateDTO } from '../../interfaces/IProject.js';
// Importamos el token del repositorio de proyectos del nuevo archivo tokens.ts
import { PROJECT_REPOSITORY } from '../../config/tokens.js';
// import { PROJECT_REPOSITORY } from '../../config/container.js'; // Importamos el token del repositorio de proyectos

@injectable()
export class ProjectService implements IProjectService {
  constructor(@inject(PROJECT_REPOSITORY) private projectRepository: IProjectRepository) {} // Inyectamos el repositorio
  /**
   * Creates a new project.
   * @param projectData Data for the new project.
   * @returns The created project.
   */
  async createProject(projectData: IProjectCreateDTO): Promise<Project> {
    return await this.projectRepository.create(projectData);
  }

  /**
   * Retrieves a project by its ID.
   * @param id The project ID.
   * @returns The project, or null if not found.
   */
  async getProjectById(id: number): Promise<Project | null> {
    return await this.projectRepository.findById(id);
  }

  /**
   * Retrieves all projects, optionally filtered by user ID.
   * @param createdById Optional user ID to filter projects by.
   * @returns An array of projects.
   */
  async getAllProjects(createdById?: number): Promise<Project[]> {
    return await this.projectRepository.findAll(createdById);
  }

  /**
   * Updates an existing project.
   * @param id The project ID to update.
   * @param projectData Data to update.
   * @returns The updated project.
   */
  async updateProject(id: number, projectData: IProjectUpdateDTO): Promise<Project> {
    return await this.projectRepository.update(id, projectData);
  }

  /**
   * Deletes a project by its ID.
   * @param id The project ID to delete.
   * @returns The deleted project.
   */
  async deleteProject(id: number): Promise<Project> {
    return await this.projectRepository.delete(id);
  }
}