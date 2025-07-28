import { Request, Response } from "express";
import { injectable, inject } from 'inversify';
import { TYPES } from '../config/types.js'; 
import { IAuthService } from '../services/interfaces/IAuthService.js';
import { handleServiceError } from '../utils/errorHandler.js';
import { Logger } from 'winston';
import { IPasswordResetRequestDTO, IPasswordResetConfirmDTO } from '../interfaces/IAuth.js'; // Importar DTOs
@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.IAuthService) private authService: IAuthService,
    @inject(TYPES.Logger) private logger: Logger,
  ) {}

  async register(req: Request, res: Response) {  
    try {
      const { username, email, password, role, phoneNumber } = req.body;
      const user = await this.authService.register({username, email, password, role, phoneNumber});
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

  async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      // const { token } = req.body

      if (!token) {
        return res.status(400).json({ message: 'No token provided for logout.' });
      }

      await this.authService.logout(token);
      res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
      this.logger.error('Failed to log out:', error);
      handleServiceError(res, error, 'Failed to log out.');
    }
  }

  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body as IPasswordResetRequestDTO;
      await this.authService.requestPasswordReset(email);
      res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
      this.logger.error('Failed to request password reset:', error);
      handleServiceError(res, error, 'Failed to request password reset.');
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const resetData: IPasswordResetConfirmDTO = req.body;
      await this.authService.resetPassword(resetData);
      res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
      this.logger.error('Failed to reset password:', error);
      handleServiceError(res, error, 'Failed to reset password.');
    }
  }

  async profile(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user; // User information attached by the auth middleware
    res.status(200).json({ message: "User profile", user });
  }
}
