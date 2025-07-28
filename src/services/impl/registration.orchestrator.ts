// src/services/impl/registration.orchestrator.ts
import { injectable, inject } from 'inversify';
import { User } from '@prisma/client';
import { TYPES } from '../../config/types.js';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository.js';
import { IEmailService, ISmsService } from '../interfaces/INotificationService.js';
import { Logger } from 'winston';

// Interfaz para el orquestador si lo deseas, pero para este caso una clase directa es suficiente
// export interface IRegistrationOrchestrator {
//   execute(username: string, email: string, passwordHash: string, roleId: number, phoneNumber?: string): Promise<User>;
// }

@injectable()
export class RegistrationOrchestrator {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IEmailService) private emailService: IEmailService,
    @inject(TYPES.ISmsService) private smsService: ISmsService,
    @inject(TYPES.Logger) private logger: Logger,
  ) {}

  public async execute(username: string, email: string, passwordHash: string, roleId: number, phoneNumber?: string): Promise<User> {
    this.logger.debug(`Orchestrating registration for user: ${email}`);

    // Paso 1: Crear el usuario (validación de existencia de email y rol ya ocurre en AuthService)
    const user = await this.userRepository.create(username, email, passwordHash, roleId);
    this.logger.info(`User created in database: ${user.email}`);

    // Paso 2: Enviar notificaciones (de forma asíncrona, sin bloquear el flujo principal)
    this.sendNotifications(user, phoneNumber)
      .catch(err => this.logger.error(`Failed to send notifications for user ${user.email}:`, err));

    return user;
  }

  private async sendNotifications(user: User, phoneNumber?: string): Promise<void> {
    await this.emailService.sendRegistrationEmail(user.email, user.username);
    this.logger.debug(`Registration email task initiated for ${user.email}`);

    if (phoneNumber) {
      await this.smsService.sendRegistrationSms(phoneNumber, user.username);
      this.logger.debug(`Registration SMS task initiated for ${user.username}`);
    } else {
      this.logger.debug(`No phone number provided for SMS notification for user ${user.email}.`);
    }
  }
}