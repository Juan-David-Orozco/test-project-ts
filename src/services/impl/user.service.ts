// src/services/impl/user.service.ts
import { injectable, inject } from 'inversify';
import { User, Role } from '@prisma/client';
import { IUserService } from '../interfaces/IUserService.js';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository.js';
import { IUserUpdateDTO, IUserCreateByAdminDTO } from '../../interfaces/IUser.js';
import { TYPES } from '../../config/types.js';
import { Logger } from 'winston';
import bcrypt from 'bcrypt';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.Logger) private logger: Logger,
  ) {}

  async getAllUsers(): Promise<(User & { role: Role })[]> {
    this.logger.debug('Fetching all users.');
    return await this.userRepository.findAll();
  }

  async getUserById(id: number, currentUserId: number, currentUserRole: string): Promise<(User & { role: Role }) | null> {
    this.logger.debug(`Fetching user with ID: ${id}`);
    const userFound = await this.userRepository.findById(id);
    if (!userFound) {
      this.logger.warn(`Fetching user failed: User with ID ${id} not found.`);
      throw new Error('User not found.');
    }
    if (currentUserRole !== 'admin' && userFound.id !== currentUserId) {
      this.logger.warn(`user ${currentUserId} You can get only your own account.`);
      throw new Error('Forbidden: You can get only your own account.');
    }
    return userFound
  }

  async createUserByAdmin(userData: IUserCreateByAdminDTO, currentUserId: number, currentUserRole: string): Promise<User & { role: Role }> {
    this.logger.info(`Admin user ${currentUserId} attempting to create new user: ${userData.email}`);

    if (currentUserRole !== 'admin') {
      this.logger.warn(`Unauthorized attempt to create user by non-admin: ${currentUserId}`);
      throw new Error('Unauthorized: Only administrators can create users.');
    }

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      this.logger.warn(`User creation failed: Email ${userData.email} already exists.`);
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const roleName = userData.roleName || 'user'; // Default to 'user' if not provided

    const role = await this.userRepository.findRoleByName(roleName);
    if (!role) {
      const validRoles = await this.userRepository.getAllRoleNames();
      const roleList = validRoles.map(r => `'${r}'`).join(', ');
      this.logger.warn(`User creation failed: Provided role '${roleName}' does not exist.`);
      throw new Error(`Role '${roleName}' does not exist. Please choose from: ${roleList}.`);
    }

    const newUser = await this.userRepository.create(userData.username, userData.email, hashedPassword, role.id);
    this.logger.info(`User created by admin: ${newUser.email} with role ${newUser.role.name}`);
    return newUser;
  }

  async updateUser(id: number, userData: IUserUpdateDTO, currentUserId: number, currentUserRole: string): Promise<User & { role: Role }> {
    this.logger.info(`User ${currentUserId} (${currentUserRole}) attempting to update user with ID: ${id}`);

    const userToUpdate = await this.userRepository.findById(id);
    if (!userToUpdate) {
      this.logger.warn(`Update user failed: User with ID ${id} not found.`);
      throw new Error('User not found.');
    }

    // Authorization: Admin can update any user; non-admin can only update their own profile.
    if (currentUserRole !== 'admin' && userToUpdate.id !== currentUserId) {
      this.logger.warn(`Unauthorized attempt to update user ${id} by user ${currentUserId}.`);
      throw new Error('Unauthorized: You can only update your own profile.');
    }

    // Prevent non-admin users from changing their role
    if (currentUserRole !== 'admin' && userData.roleId !== undefined && userData.roleId !== userToUpdate.roleId) {
      this.logger.warn(`Unauthorized attempt to change role for user ${id} by non-admin user ${currentUserId}.`);
      throw new Error('Unauthorized: Only administrators can change user roles.');
    }

    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Resolve roleId to role name if provided
    if (userData.roleId) {
      const newRole = await this.userRepository.findRoleById(userData.roleId);
      if (!newRole) {
          throw new Error(`Role with ID ${userData.roleId} not found.`);
      }
    }


    const updatedUser = await this.userRepository.update(id, userData);
    this.logger.info(`User ${id} updated by user ${currentUserId}.`);
    return updatedUser;
  }

  async deleteUser(id: number, currentUserId: number, currentUserRole: string): Promise<User> {
    this.logger.info(`User ${currentUserId} (${currentUserRole}) attempting to delete user with ID: ${id}`);

    const userToDelete = await this.userRepository.findById(id);
    if (!userToDelete) {
      this.logger.warn(`Delete user failed: User with ID ${id} not found.`);
      throw new Error('User not found.');
    }

    // Authorization: Only admin can delete users, and an admin cannot delete themselves.
    if (currentUserRole !== 'admin') {
      this.logger.warn(`Unauthorized attempt to delete user ${id} by non-admin user ${currentUserId}.`);
      throw new Error('Unauthorized: Only administrators can delete users.');
    }
    if (userToDelete.id === currentUserId) {
      this.logger.warn(`Admin user ${currentUserId} attempted to delete themselves.`);
      throw new Error('Forbidden: You cannot delete your own account.');
    }

    const deletedUser = await this.userRepository.delete(id);
    this.logger.info(`User ${id} deleted by admin user ${currentUserId}.`);
    return deletedUser;
  }
}