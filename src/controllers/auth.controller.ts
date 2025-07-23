import { Request, Response } from "express";
import { injectable, inject } from 'tsyringe';
import { IAuthService } from '../services/interfaces/IAuthService.js';
import { handleServiceError } from '../utils/errorHandler.js';
import { AUTH_SERVICE } from '../config/tokens.js';
// import { AUTH_SERVICE } from '../config/container.js'; // Importamos el token del servicio de auth
// import { AuthService } from "../services/impl/auth.service.js";

@injectable()
export class AuthController {
  constructor(@inject(AUTH_SERVICE) private authService: IAuthService) {} // Inyectamos el servicio de auth
  async register(req: Request, res: Response) {  
    try {
      const { username, email, password, role } = req.body;
      const user = await this.authService.register({username, email, password, role});
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      handleServiceError(res, error, 'Failed to register user.');
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login({email, password});
      res.status(200).json({ message: "Logged in successfully", user, token });
    } catch (error: any) {
      handleServiceError(res, error, 'Failed to log in.');
    }
  }

  async profile(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user; // User information attached by the auth middleware
    res.status(200).json({ message: "User profile", user });
  }
}
