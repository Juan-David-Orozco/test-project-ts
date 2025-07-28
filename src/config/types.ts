// src/config/types.ts
export const TYPES = {
  
  PrismaClient: Symbol.for('PrismaClient'), // Cliente Prisma
  RedisClient: Symbol.for('RedisClient'), // Nuevo tipo para Redis
  // Repositorios
  IUserRepository: Symbol.for('IUserRepository'),
  IProjectRepository: Symbol.for('IProjectRepository'),

  // Servicios
  IAuthService: Symbol.for('IAuthService'),
  IUserService: Symbol.for('IUserService'), // Servicios de Usuario
  IProjectService: Symbol.for('IProjectService'),
  IEmailService: Symbol.for('IEmailService'), // Servicios de Notificación (Email)
  ISmsService: Symbol.for('ISmsService'), // Servicios de Notificación (Sms)
  // Logger
  Logger: Symbol.for('Logger'),
  // Orquestador de Registro
  RegistrationOrchestrator: Symbol.for('RegistrationOrchestrator'),

  // Controladores (aunque no siempre se inyectan directamente, es buena práctica tener el token si planeas resolverlos)
  AuthController: Symbol.for('AuthController'),
  UserController: Symbol.for('UserController'),
  ProjectController: Symbol.for('ProjectController'),
};