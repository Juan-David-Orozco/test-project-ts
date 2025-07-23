import { InjectionToken } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

// Interfaces for repositories
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import { IProjectRepository } from '../repositories/interfaces/IProjectRepository.js';

// Interfaces for services
import { IAuthService } from '../services/interfaces/IAuthService.js';
import { IProjectService } from '../services/interfaces/IProjectService.js';

// Define tokens for injection (string literals or symbols)
export const PRISMA_CLIENT: InjectionToken<PrismaClient> = 'PrismaClient';

export const USER_REPOSITORY: InjectionToken<IUserRepository> = 'IUserRepository';
export const PROJECT_REPOSITORY: InjectionToken<IProjectRepository> = 'IProjectRepository';

export const AUTH_SERVICE: InjectionToken<IAuthService> = 'IAuthService';
export const PROJECT_SERVICE: InjectionToken<IProjectService> = 'IProjectService';