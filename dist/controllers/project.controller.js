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
import { injectable, inject } from 'tsyringe';
import { handleServiceError } from '../utils/errorHandler.js';
import { PROJECT_SERVICE } from '../config/tokens.js';
// import { PROJECT_SERVICE } from '../config/container.js'; // Importamos el token del servicio de proyectos
// import { ProjectService } from '../services/impl/project.service.js';
let ProjectController = class ProjectController {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    } // Inyectamos el servicio de proyectos
    async createProject(req, res) {
        try {
            // @ts-ignore
            const createdById = req.user.id; // Get user ID from authenticated request
            const projectData = { ...req.body, createdById };
            const project = await this.projectService.createProject(projectData);
            res.status(201).json({ message: 'Project created successfully', project });
        }
        catch (error) {
            handleServiceError(res, error, 'Failed to create project.');
        }
    }
    async getProjectById(req, res) {
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
        }
        catch (error) {
            handleServiceError(res, error, 'Failed to retrieve project.');
        }
    }
    async getAllProjects(req, res) {
        try {
            // @ts-ignore
            const userId = req.user.id; // Get user ID for potential filtering
            // You might add query parameters for more complex filtering later
            const projects = await this.projectService.getAllProjects();
            res.status(200).json(projects);
        }
        catch (error) {
            handleServiceError(res, error, 'Failed to retrieve projects.');
        }
    }
    async updateProject(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid project ID.' });
            }
            const projectData = req.body;
            const updatedProject = await this.projectService.updateProject(id, projectData);
            res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
        }
        catch (error) {
            handleServiceError(res, error, 'Failed to update project.');
        }
    }
    async deleteProject(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid project ID.' });
            }
            const deletedProject = await this.projectService.deleteProject(id);
            res.status(200).json({ message: 'Project deleted successfully', project: deletedProject });
        }
        catch (error) {
            handleServiceError(res, error, 'Failed to delete project.');
        }
    }
};
ProjectController = __decorate([
    injectable(),
    __param(0, inject(PROJECT_SERVICE)),
    __metadata("design:paramtypes", [Object])
], ProjectController);
export { ProjectController };
//# sourceMappingURL=project.controller.js.map