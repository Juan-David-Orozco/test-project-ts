// src/services/impl/sms.service.ts
import twilio from 'twilio';
import { injectable, inject } from 'inversify';
import { ISmsService } from '../interfaces/INotificationService.js';
import { Logger } from 'winston';
import { TYPES } from '../../config/types.js';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '../../config/conf.js';


@injectable()
export class SmsService implements ISmsService {
  private client: twilio.Twilio;
  private twilioPhoneNumber: string;
  private logger: Logger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
    const accountSid = TWILIO_ACCOUNT_SID;
    const authToken = TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = TWILIO_PHONE_NUMBER as string;

    if (!accountSid || !authToken || !this.twilioPhoneNumber) {
      this.logger.error('Twilio credentials are not fully configured in environment variables.');
      throw new Error('Twilio credentials missing.');
    }
    this.client = twilio(accountSid, authToken);
    this.logger.info('Twilio client initialized.');
  }

  async sendRegistrationSms(toPhoneNumber: string, username: string): Promise<void> {
    // Aquí iría la lógica real para enviar el SMS,
    try {
      const message = await this.client.messages.create({
        body: `¡Bienvenido ${username}! Gracias por registrarte en nuestra plataforma.`,
        from: this.twilioPhoneNumber,
        to: toPhoneNumber,
      });
      this.logger.info(`SMS sent successfully to ${toPhoneNumber}: ${message.sid}`);
    } catch (error) {
      this.logger.error(`Failed to send registration SMS to ${toPhoneNumber}:`, error);
      throw new Error(`Failed to send registration SMS: ${error}`);
    }
    // por ejemplo, usando Twilio.
    // console.log(`[SmsService] Enviando SMS de bienvenida a ${toPhoneNumber} para el usuario ${username}.`);
    // console.log(`Mensaje: ¡Bienvenido ${username}! Gracias por registrarte.`);
    // throw new Error('Método no implementado: Integrar Twilio aquí.');
  }
}