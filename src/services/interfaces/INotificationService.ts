export interface IEmailService {
  sendRegistrationEmail(to: string, username: string): Promise<void>;
  sendPasswordResetEmail(to: string, username: string, resetLink: string): Promise<void>; // Nuevo
  // Puedes añadir otros métodos como sendResetPasswordEmail, etc.
}

export interface ISmsService {
  sendRegistrationSms(toPhoneNumber: string, username: string): Promise<void>;
  // Puedes añadir otros métodos
}