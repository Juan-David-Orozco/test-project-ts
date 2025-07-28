// src/routes/auth.routes.ts
import { Router } from "express";
import { container } from "../config/inversify.config.js";
import { AuthController } from "../controllers/auth.controller.js";
import { TYPES } from "../config/types.js"; // Importar los tipos/símbolos

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/zod.validation.middleware.ts.js";
import { RegisterSchema, LoginSchema, PasswordResetRequestSchema, PasswordResetConfirmSchema } from "../interfaces/IAuth.js"; // Importar esquemas Zod

const router = Router();

// Resolver el controlador desde el contenedor. InversifyJS se encargará de inyectar las dependencias del controlador.
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/register", validate(RegisterSchema), (req, res) => authController.register(req, res));

router.post("/login", validate(LoginSchema), (req, res) => authController.login(req, res));

router.post('/logout', authenticateToken, (req, res) => { // Requiere token para saber qué sesión cerrar
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'No token provided.' });
  }
  req.body.token = token; // Pasar el token al controlador
  authController.logout(req, res);
});

// Rutas de recuperación de contraseña
router.post('/request-password-reset', validate(PasswordResetRequestSchema), (req, res) => authController.requestPasswordReset(req, res));
router.post('/reset-password', validate(PasswordResetConfirmSchema), (req, res) => authController.resetPassword(req, res));

router.get("/profile", authenticateToken, (req, res) =>
  authController.profile(req, res)
);

router.get(
  "/admin-dashboard",
  authenticateToken,
  authorizeRoles(["admin"]),
  (req, res) => {
    res.status(200).json({ message: "Welcome to the admin dashboard!" });
  }
);
router.get(
  "/user-dashboard",
  authenticateToken,
  authorizeRoles(["user", "admin"]),
  (req, res) => {
    res.status(200).json({ message: "Welcome to your user dashboard!" });
  }
);

export default router;
