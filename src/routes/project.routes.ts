import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// All project routes require authentication
router.use(authenticateToken);

// Create Project: Only admins can create, or perhaps any authenticated user (depends on business logic)
// For now, let's allow 'user' and 'admin' to create projects
router.post('/', authorizeRoles(['admin', 'user']), ProjectController.createProject);

// Get All Projects: Any authenticated user can view all projects
router.get('/', ProjectController.getAllProjects); // Consider adding filtering/pagination later

// Get Project by ID: Any authenticated user can view a specific project
router.get('/:id', ProjectController.getProjectById);

// Update Project: Only the owner or an admin can update.
// This requires a check in the controller or a more specific middleware.
// For simplicity, let's allow 'admin' and 'user' to update, but the controller
// will ensure the user is the creator or an admin (if we implement that logic).
router.put('/:id', authorizeRoles(['admin', 'user']), ProjectController.updateProject);

// Delete Project: Only the owner or an admin can delete.
router.delete('/:id', authorizeRoles(['admin']), ProjectController.deleteProject);

export default router;