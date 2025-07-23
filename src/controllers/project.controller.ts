import { Request, Response } from 'express';
// import { injectable, inject } from 'tsyringe';
import { injectable, inject } from 'inversify';
import { TYPES } from '../config/types.js'; 
import { IProjectService } from '../services/interfaces/IProjectService.js';
import { handleServiceError } from '../utils/errorHandler.js';
import { IProjectCreateDTO, IProjectUpdateDTO } from '../interfaces/IProject.js';
// import { PROJECT_SERVICE } from '../config/tokens.js';
// import { PROJECT_SERVICE } from '../config/container.js'; // Importamos el token del servicio de proyectos
// import { ProjectService } from '../services/impl/project.service.js';

@injectable()
export class ProjectController {
  constructor(@inject(TYPES.IProjectService) private projectService: IProjectService) {} // Inyectamos el servicio de proyectos
  // private projectService: IProjectService;
  // constructor(projectService: IProjectService) { // Acepta IProjectService a través del constructor
  //   this.projectService = projectService;
  // }

  async createProject(req: Request, res: Response) {
    try {
      // @ts-ignore
      const createdById = req.user.id; // Get user ID from authenticated request
      const projectData: IProjectCreateDTO = { ...req.body, createdById  };
      const project = await this.projectService.createProject(projectData);
      res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
      handleServiceError(res, error, 'Failed to create project.');
    }
  }

  async getProjectById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID.' });
      }
      const project = await this.projectService.getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
      }
      res.status(200).json(project);
    } catch (error) {
      handleServiceError(res, error, 'Failed to retrieve project.');
    }
  }

  async getAllProjects(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id; // Get user ID for potential filtering
      // You might add query parameters for more complex filtering later
      const projects = await this.projectService.getAllProjects();
      res.status(200).json(projects);
    } catch (error) {
      handleServiceError(res, error, 'Failed to retrieve projects.');
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID.' });
      }
      const projectData: IProjectUpdateDTO = req.body;
      const updatedProject = await this.projectService.updateProject(id, projectData);
      res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
      handleServiceError(res, error, 'Failed to update project.');
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID.' });
      }
      const deletedProject = await this.projectService.deleteProject(id);
      res.status(200).json({ message: 'Project deleted successfully', project: deletedProject });
    } catch (error) {
      handleServiceError(res, error, 'Failed to delete project.');
    }
  }
}