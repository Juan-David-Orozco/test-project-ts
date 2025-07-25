// src/services/impl/email.service.ts
import { injectable } from 'inversify';
import { IEmailService } from '../interfaces/INotificationService.js';

@injectable()
export class EmailService implements IEmailService {
  async sendRegistrationEmail(to: string, username: string): Promise<void> {
    // Aquí iría la lógica real para enviar el correo electrónico,
    // por ejemplo, usando Nodemailer.
    console.log(`[EmailService] Enviando correo de bienvenida a ${to} para el usuario ${username}.`);
    console.log(`Asunto: ¡Bienvenido a nuestra plataforma!`);
    console.log(`Cuerpo: Hola ${username}, ¡gracias por registrarte!`);
    // throw new Error('Método no implementado: Integrar Nodemailer aquí.');
  }
}