import { Project } from '@prisma/client';
import { IProjectCreateDTO, IProjectUpdateDTO } from '../../interfaces/IProject.js';

export interface IProjectService {
  createProject(projectData: IProjectCreateDTO): Promise<Project>;
  getProjectById(id: number): Promise<Project | null>;
  getAllProjects(createdById?: number): Promise<Project[]>;
  updateProject(id: number, projectData: IProjectUpdateDTO, userId: number | undefined, userRole: string | undefined): Promise<Project>;
  deleteProject(id: number, userId: number | undefined, userRole: string | undefined): Promise<Project>;
}