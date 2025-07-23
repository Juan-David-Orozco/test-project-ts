import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// Resolve AuthController instance from the container
const authController = container.resolve(AuthController);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/profile', authenticateToken, (req, res) => authController.profile(req, res));

router.get('/admin-dashboard', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!' });
});
router.get('/user-dashboard', authenticateToken, authorizeRoles(['user', 'admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome to your user dashboard!' });
});

export default router;