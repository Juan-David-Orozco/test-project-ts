// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IUserService } from '../services/interfaces/IUserService.js';
import { handleServiceError } from '../utils/errorHandler.js';
import { TYPES } from '../config/types.js';
import { IUserUpdateDTO, IUserCreateByAdminDTO } from '../interfaces/IUser.js';
import { Logger } from 'winston';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.IUserService) private userService: IUserService,
    @inject(TYPES.Logger) private logger: Logger,
  ) {}

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      this.logger.error('Failed to retrieve all users:', error);
      handleServiceError(res, error, 'Failed to retrieve users.');
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
      }
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json(user);
    } catch (error) {
      this.logger.error(`Failed to retrieve user with ID ${req.params.id}:`, error);
      handleServiceError(res, error, 'Failed to retrieve user.');
    }
  }

  async createUserByAdmin(req: Request, res: Response) {
    try {
      // @ts-ignore
      const currentUserId = req.user.id;
      // @ts-ignore
      const currentUserRole = req.user.role;
      const userData: IUserCreateByAdminDTO = req.body; // Zod validation already happened

      const newUser = await this.userService.createUserByAdmin(userData, currentUserId, currentUserRole);
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      this.logger.error('Failed to create user by admin:', error);
      handleServiceError(res, error, 'Failed to create user.');
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
      }
      const userData: IUserUpdateDTO = req.body; // Zod validation already happened
      // @ts-ignore
      const currentUserId = req.user.id;
      // @ts-ignore
      const currentUserRole = req.user.role;

      const updatedUser = await this.userService.updateUser(id, userData, currentUserId, currentUserRole);
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      this.logger.error(`Failed to update user with ID ${req.params.id}:`, error);
      handleServiceError(res, error, 'Failed to update user.');
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
      }
      // @ts-ignore
      const currentUserId = req.user.id;
      // @ts-ignore
      const currentUserRole = req.user.role;

      const deletedUser = await this.userService.deleteUser(id, currentUserId, currentUserRole);
      res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${req.params.id}:`, error);
      handleServiceError(res, error, 'Failed to delete user.');
    }
  }
}