import { Router } from "express";
// import prisma from "../config/prisma.js";

// import { container } from 'tsyringe';
import { container } from '../config/inversify.config.js';
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { TYPES } from '../config/types.js'; // Importar los tipos/símbolos
// import { UserRepository } from "../repositories/impl/user.repository.js";
// import { AuthService } from "../services/impl/auth.service.js";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

// Composicion DI
// const userRepository = new UserRepository(prisma);
// const authService = new AuthService(userRepository);
// const authController = new AuthController(authService);

// Resolve AuthController instance from the container
// const authController = container.resolve(AuthController);

// Resolver el controlador desde el contenedor. InversifyJS se encargará de inyectar las dependencias del controlador.
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
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
