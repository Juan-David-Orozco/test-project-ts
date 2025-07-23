// src/config/types.ts
export const TYPES = {
  // Cliente Prisma
  PrismaClient: Symbol.for('PrismaClient'),

  // Repositorios
  IUserRepository: Symbol.for('IUserRepository'),
  IProjectRepository: Symbol.for('IProjectRepository'),

  // Servicios
  IAuthService: Symbol.for('IAuthService'),
  IProjectService: Symbol.for('IProjectService'),

  // Controladores (aunque no siempre se inyectan directamente, es buena práctica tener el token si planeas resolverlos)
  AuthController: Symbol.for('AuthController'),
  ProjectController: Symbol.for('ProjectController'),
};