// src/routes/user.routes.ts
import { Router } from 'express';
import { container } from '../config/inversify.config.js';
import { UserController } from '../controllers/user.controller.js';
import { TYPES } from '../config/types.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/zod.validation.middleware.ts.js'; // Usaremos el nuevo middleware Zod
import { UserUpdateSchema, UserCreateByAdminSchema } from '../interfaces/IUser.js'; // Importar esquemas Zod

const router = Router();
const userController = container.get<UserController>(TYPES.UserController);

// Todas las rutas de gestión de usuarios requieren autenticación
router.use(authenticateToken);

// Obtener todos los usuarios (solo admins)
router.get('/', authorizeRoles(['admin']), (req, res) => userController.getAllUsers(req, res));

// Obtener un usuario por ID (admins pueden ver cualquiera; users pueden ver el suyo)
// La lógica de autorización estará en el servicio para este caso.
router.get('/:id', authorizeRoles(['admin', 'user']), (req, res) => userController.getUserById(req, res));

// Crear un usuario (solo admins)
router.post('/', authorizeRoles(['admin']), validate(UserCreateByAdminSchema), (req, res) => userController.createUserByAdmin(req, res));

// Actualizar un usuario (admins cualquiera; users el suyo)
router.put('/:id', authorizeRoles(['admin', 'user']), validate(UserUpdateSchema), (req, res) => userController.updateUser(req, res));

// Eliminar un usuario (solo admins, y no a sí mismo)
router.delete('/:id', authorizeRoles(['admin']), (req, res) => userController.deleteUser(req, res));

export default router;