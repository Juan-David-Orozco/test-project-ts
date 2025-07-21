import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service.js';
import { handleServiceError } from '../utils/errorHandler.js';
import { IProjectCreateDTO, IProjectUpdateDTO } from '../interfaces/IProject.js';

export class ProjectController {
  static async createProject(req: Request, res: Response) {
    try {
      // @ts-ignore
      const createdById = req.user.id; // Get user ID from authenticated request
      const projectData: IProjectCreateDTO = { ...req.body, createdById };
      const project = await ProjectService.createProject(projectData);
      res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
      handleServiceError(res, error, 'Failed to create project.');
    }
  }

  static async getProjectById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID.' });
      }
      const project = await ProjectService.getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
      }
      res.status(200).json(project);
    } catch (error) {
      handleServiceError(res, error, 'Failed to retrieve project.');
    }
  }

  static async getAllProjects(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id; // Get user ID for potential filtering
      // You might add query parameters for more complex filtering later
      const projects = await ProjectService.getAllProjects(); // Or ProjectService.getAllProjects(userId) for user-specific
      res.status(200).json(projects);
    } catch (error) {
      handleServiceError(res, error, 'Failed to retrieve projects.');
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID.' });
      }
      const projectData: IProjectUpdateDTO = req.body;
      const updatedProject = await ProjectService.updateProject(id, projectData);
      res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
      handleServiceError(res, error, 'Failed to update project.');
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid project ID.' });
      }
      const deletedProject = await ProjectService.deleteProject(id);
      res.status(200).json({ message: 'Project deleted successfully', project: deletedProject });
    } catch (error) {
      handleServiceError(res, error, 'Failed to delete project.');
    }
  }
}