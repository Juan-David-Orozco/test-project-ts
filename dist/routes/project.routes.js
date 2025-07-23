import { Router } from 'express';
import { container } from 'tsyringe';
import { ProjectController } from '../controllers/project.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
const router = Router();
// Resolve ProjectController instance from the container
const projectController = container.resolve(ProjectController);
// All project routes require authentication
router.use(authenticateToken);
// Create Project: Only admins can create, or perhaps any authenticated user (depends on business logic)
// For now, let's allow 'user' and 'admin' to create projects
router.post('/', authorizeRoles(['admin', 'user']), (req, res) => projectController.createProject(req, res));
// Get All Projects: Any authenticated user can view all projects
router.get('/', (req, res) => projectController.getAllProjects(req, res)); // Consider adding filtering/pagination later
// Get Project by ID: Any authenticated user can view a specific project
router.get('/:id', (req, res) => projectController.getProjectById(req, res));
// Update Project: Only the owner or an admin can update.
// This requires a check in the controller or a more specific middleware.
// For simplicity, let's allow 'admin' and 'user' to update, but the controller
// will ensure the user is the creator or an admin (if we implement that logic).
router.put('/:id', authorizeRoles(['admin', 'user']), (req, res) => projectController.updateProject(req, res));
// Delete Project: Only the admin can delete.
router.delete('/:id', authorizeRoles(['admin']), (req, res) => projectController.deleteProject(req, res));
export default router;
//# sourceMappingURL=project.routes.js.map