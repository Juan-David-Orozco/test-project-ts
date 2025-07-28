// src/services/impl/email.service.ts
import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { injectable, inject } from 'inversify';
import { IEmailService } from '../interfaces/INotificationService.js';
import { Logger } from 'winston';
import { TYPES } from '../../config/types.js';
import { EMAIL_PASS, EMAIL_SERVICE, EMAIL_USER } from '../../config/conf.js'

@injectable()
export class EmailService implements IEmailService {
  private transporter: Transporter;
  private logger: Logger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
    this.transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE, // ej. 'gmail'
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Verificar la configuración del transporte (opcional, útil para depuración)
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email transporter verification failed:', error);
      } else {
        this.logger.info('Email transporter is ready to send messages.');
      }
    });
  }
  async sendRegistrationEmail(to: string, username: string): Promise<void> {
    try {
      const mailOptions = {
        from: EMAIL_USER,
        to: to,
        subject: '¡Bienvenido a nuestra plataforma!',
        html: `
          <h1>Hola ${username},</h1>
          <p>¡Gracias por registrarte en nuestra plataforma! Estamos emocionados de tenerte con nosotros.</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p>Saludos,<br>El Equipo de [Tu Plataforma]</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send registration email to ${to}:`, error);
      throw new Error(`Failed to send registration email: ${error}`);
    }    
  }

  // NUEVO MÉTODO PARA RECUPERACIÓN DE CONTRASEÑA
  async sendPasswordResetEmail(to: string, username: string, resetLink: string): Promise<void> {
    try {
      const mailOptions = {
        from: EMAIL_USER,
        to: to,
        subject: 'Restablecer tu Contraseña',
        html: `
          <h1>Hola ${username},</h1>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetLink}">Restablecer Contraseña</a>
          <p>Este enlace es válido por 15 minutos.</p>
          <p>Si no solicitaste un restablecimiento de contraseña, ignora este correo electrónico.</p>
          <p>Saludos,<br>El Equipo de [Tu Plataforma]</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.info(`Password reset email sent successfully to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}:`, error);
      throw new Error(`Failed to send password reset email: ${error}`);
    }
  }

}