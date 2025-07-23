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
// Importamos el tipo 'Project' directamente de @prisma/client
// Ya no necesitamos importar IProject desde interfaces, ya que usaremos el tipo de Prisma
import { injectable, inject } from 'tsyringe';
// Importamos el token del repositorio de proyectos del nuevo archivo tokens.ts
import { PROJECT_REPOSITORY } from '../../config/tokens.js';
// import { PROJECT_REPOSITORY } from '../../config/container.js'; // Importamos el token del repositorio de proyectos
let ProjectService = class ProjectService {
    projectRepository;
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    } // Inyectamos el repositorio
    /**
     * Creates a new project.
     * @param projectData Data for the new project.
     * @returns The created project.
     */
    async createProject(projectData) {
        return await this.projectRepository.create(projectData);
    }
    /**
     * Retrieves a project by its ID.
     * @param id The project ID.
     * @returns The project, or null if not found.
     */
    async getProjectById(id) {
        return await this.projectRepository.findById(id);
    }
    /**
     * Retrieves all projects, optionally filtered by user ID.
     * @param createdById Optional user ID to filter projects by.
     * @returns An array of projects.
     */
    async getAllProjects(createdById) {
        return await this.projectRepository.findAll(createdById);
    }
    /**
     * Updates an existing project.
     * @param id The project ID to update.
     * @param projectData Data to update.
     * @returns The updated project.
     */
    async updateProject(id, projectData) {
        return await this.projectRepository.update(id, projectData);
    }
    /**
     * Deletes a project by its ID.
     * @param id The project ID to delete.
     * @returns The deleted project.
     */
    async deleteProject(id) {
        return await this.projectRepository.delete(id);
    }
};
ProjectService = __decorate([
    injectable(),
    __param(0, inject(PROJECT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProjectService);
export { ProjectService };
//# sourceMappingURL=project.service.js.map