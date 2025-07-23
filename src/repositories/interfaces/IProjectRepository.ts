import { Project } from '@prisma/client';
import { IProjectCreateDTO, IProjectUpdateDTO } from '../../interfaces/IProject.js';

export interface IProjectRepository {
  create(data: IProjectCreateDTO): Promise<Project>;
  findById(id: number): Promise<Project | null>;
  findAll(createdById?: number): Promise<Project[]>;
  update(id: number, data: IProjectUpdateDTO): Promise<Project>;
  delete(id: number): Promise<Project>;
}