// src/config/inversify.config.ts
import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { Logger } from 'winston'; // Importar el tipo Logger de Winston
import { TYPES } from './types.js'; // Importar los símbolos de inyección
import logger from './logger.js'; // Importar la instancia configurada de Winston

// Importar las interfaces de Repositorios y Servicios
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import { IProjectRepository } from '../repositories/interfaces/IProjectRepository.js';

// Importar las interfaces de Servicios
import { IAuthService } from '../services/interfaces/IAuthService.js';
import { IUserService } from '../services/interfaces/IUserService.js'; // Nuevas interfaces
import { IEmailService, ISmsService } from '../services/interfaces/INotificationService.js'; // Nuevas interfaces
import { IProjectService } from '../services/interfaces/IProjectService.js';

// Importar las implementaciones concretas
import { UserRepository } from '../repositories/impl/user.repository.js';
import { ProjectRepository } from '../repositories/impl/project.repository.js';
import { AuthService } from '../services/impl/auth.service.js';
import { UserService } from '../services/impl/user.service.js';
import { EmailService } from '../services/impl/email.service.js'; // Nueva implementación
import { SmsService } from '../services/impl/sms.service.js'; // Nueva implementación
import { ProjectService } from '../services/impl/project.service.js';

import { RegistrationOrchestrator } from '../services/impl/registration.orchestrator.js';

import { AuthController } from '../controllers/auth.controller.js';
import { UserController } from '../controllers/user.controller.js';
import { ProjectController } from '../controllers/project.controller.js';

const container = new Container();

// --- Registros ---

// 1. PrismaClient como Singleton
// Esto asegura que solo haya una instancia de PrismaClient en toda la aplicación.
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());

// 2. Repositorios (se instancian cada vez que se piden a menos que se defina lo contrario)
// Notar que el constructor del repositorio necesitará el PrismaClient. Inversify lo inyectará automáticamente
// porque UserRepository también usará `@inject(TYPES.PrismaClient)`.
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IProjectRepository>(TYPES.IProjectRepository).to(ProjectRepository);

// 3. Servicios (se instancian cada vez que se piden)
// Los servicios también tendrán sus dependencias (repositorios) inyectadas automáticamente.
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<ISmsService>(TYPES.ISmsService).to(SmsService);
container.bind<IProjectService>(TYPES.IProjectService).to(ProjectService);

// 4. Controladores (se instancian cada vez que se piden en las rutas)
// Sus dependencias (servicios) también serán inyectadas.
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<ProjectController>(TYPES.ProjectController).to(ProjectController);

// NUEVO Registro para el Logger como constante (singleton)
container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
// Nuevo bind para el Orquestador de Registro
container.bind<RegistrationOrchestrator>(TYPES.RegistrationOrchestrator).to(RegistrationOrchestrator);

export { container };