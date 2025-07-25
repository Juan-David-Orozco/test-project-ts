export interface IEmailService {
  sendRegistrationEmail(to: string, username: string): Promise<void>;
  // Puedes añadir otros métodos como sendResetPasswordEmail, etc.
}

export interface ISmsService {
  sendRegistrationSms(toPhoneNumber: string, username: string): Promise<void>;
  // Puedes añadir otros métodos
}