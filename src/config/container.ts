import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
// Import concrete implementations
import { UserRepository } from '../repositories/impl/user.repository.js';
import { ProjectRepository } from '../repositories/impl/project.repository.js';
import { AuthService } from '../services/impl/auth.service.js';
import { ProjectService } from '../services/impl/project.service.js';

// Import tokens
import {
  PRISMA_CLIENT,
  USER_REPOSITORY,
  PROJECT_REPOSITORY,
  AUTH_SERVICE,
  PROJECT_SERVICE,
} from './tokens.js';


// Register concrete implementations for interfaces
export function registerDependencies(): void {
  // Register PrismaClient as a singleton
  container.registerSingleton(PRISMA_CLIENT, PrismaClient);

  // Register repositories
  container.register(USER_REPOSITORY, UserRepository);
  container.register(PROJECT_REPOSITORY, ProjectRepository);
  
  // Register services
  container.register(AUTH_SERVICE, AuthService);
  container.register(PROJECT_SERVICE, ProjectService);
}