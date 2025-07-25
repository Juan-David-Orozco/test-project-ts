// src/services/impl/sms.service.ts
import { injectable } from 'inversify';
import { ISmsService } from '../interfaces/INotificationService.js';

@injectable()
export class SmsService implements ISmsService {
  async sendRegistrationSms(toPhoneNumber: string, username: string): Promise<void> {
    // Aquí iría la lógica real para enviar el SMS,
    // por ejemplo, usando Twilio.
    console.log(`[SmsService] Enviando SMS de bienvenida a ${toPhoneNumber} para el usuario ${username}.`);
    console.log(`Mensaje: ¡Bienvenido ${username}! Gracias por registrarte.`);
    // throw new Error('Método no implementado: Integrar Twilio aquí.');
  }
}