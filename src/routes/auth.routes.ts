import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', authenticateToken, AuthController.profile);

router.get('/admin-dashboard', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!' });
});
router.get('/user-dashboard', authenticateToken, authorizeRoles(['user', 'admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome to your user dashboard!' });
});

export default router;