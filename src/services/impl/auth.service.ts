import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_RESET_SECRET, FRONTEND_URL } from "../../config/conf.js";
import { injectable, inject } from "inversify";
import { Logger } from "winston";
import Redis from 'ioredis'; // Importar Redis

import { IAuthService } from "../interfaces/IAuthService.js";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository.js";
import {
  IRegisterDTO,
  ILoginDTO,
  IAuthResponse,
  IPasswordResetConfirmDTO
} from "../../interfaces/IAuth.js";
import { User } from "@prisma/client";
import { TYPES } from "../../config/types.js";
import { RegistrationOrchestrator } from "./registration.orchestrator.js"; // Importar el orquestador
import { IEmailService } from "../interfaces/INotificationService.js";

@injectable()
export class AuthService implements IAuthService {
  private userRepository: IUserRepository;
  private logger: Logger;
  private registrationOrchestrator: RegistrationOrchestrator;
  private redisClient: Redis; // Añadir cliente Redis
  private emailService: IEmailService; // Para recuperación de contraseña
  // private emailService: IEmailService;
  // private smsService: ISmsService;

  constructor(
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.RegistrationOrchestrator)
    registrationOrchestrator: RegistrationOrchestrator, // Inyectar el orquestador
    @inject(TYPES.RedisClient) redisClient: Redis, // Inyectar Redis
    @inject(TYPES.IEmailService) emailService: IEmailService, // Inyectar EmailService (Recovery password)
  ) {
    this.userRepository = userRepository;
    this.logger = logger;
    this.registrationOrchestrator = registrationOrchestrator;
    this.redisClient = redisClient;
    this.emailService = emailService;
  }

  async register(
    registerData: IRegisterDTO
  ): Promise<Partial<User & { role: { name: string } }>> {
    this.logger.debug(`[AuthService] Attempting to register new user: ${registerData.email}`);
    // this.logger.debug(`Attempting to register new user: ${registerData.email}`);
    const { username, email, password, role: roleName = "user", phoneNumber } = registerData;

    // Paso 1 (SRP de AuthService): Validar la unicidad del email
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      this.logger.warn(`[AuthService] Registration failed: User with email ${email} already exists.`);
      // this.logger.warn(`Registration failed: User with email ${email} already exists.`);
      throw new Error("User with this email already exists.");
    }
  
    // Paso 2 (SRP de AuthService): Validar la existencia y obtener el ID del rol
    let role = await this.userRepository.findRoleByName(roleName);

    if (!role) {
      // Si el rol no existe, obtenemos todos los roles válidos para el mensaje de error
      const validRoles = await this.userRepository.getAllRoleNames();
      const roleList = validRoles.map((r: any) => `'${r}'`).join(", ");
      this.logger.warn(`[AuthService] Registration failed: Provided role '${roleName}' does not exist.`);
      // this.logger.warn(`Registration failed: Provided role '${roleName}' does not exist.`);
      throw new Error(
        `Role '${roleName}' does not exist. Please choose from: ${roleList}.`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- CAMBIO CLAVE: Delegar la creación del usuario y las notificaciones al orquestador ---
    const user = await this.registrationOrchestrator.execute(
      username,
      email,
      hashedPassword,
      role.id,
      phoneNumber
    );
    this.logger.info(`[AuthService] User registration process completed for: ${user.email}`);

    return { id: user.id, username: user.username, email: user.email, role: { name: role.name } };
  }

  async login(loginData: ILoginDTO): Promise<IAuthResponse> {
    this.logger.debug(`[AuthService] Attempting to log in user: ${loginData.email}`);
    // this.logger.debug(`Attempting to log in user: ${loginData.email}`);
    const { email, password } = loginData;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(`[AuthService] Login failed for email ${email}: User not found.`);
      // this.logger.warn(`Login failed for email ${email}: User not found.`);
      throw new Error("Invalid credentials. Email incorrect.");
    }
    // Check if user is active
    if (!user.isActive) {
      this.logger.warn(`[AuthService] Login failed for email ${email}: User not found.`);
      // this.logger.warn(`Login failed for email ${email}: User is deactivated.`);
      throw new Error("Account is deactivated");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`[AuthService] Login failed for email ${email}: Invalid password.`);
      // this.logger.warn(`Login failed for email ${email}: Invalid password.`);
      throw new Error("Invalid credentials. Password incorrect.");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.name },
      JWT_SECRET as string,
      { expiresIn: "2d" }
    );

    this.logger.info(`[AuthService] User logged in successfully: ${user.email}`);
    // this.logger.info(`User logged in successfully: ${user.email}`);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        role: user.role.name,
      },
      token,
    };
  }

  async logout(token: string): Promise<void> {
    this.logger.debug(`[AuthService] Attempting to log out token.`);
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      if (decoded && decoded.exp) {
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // Tiempo de vida restante en segundos
        if (expiresIn > 0) {
          await this.redisClient.setex(`blacklist:${token}`, expiresIn, 'blacklisted');
          this.logger.info(`[AuthService] Token blacklisted for ${expiresIn} seconds.`);
        } else {
          this.logger.warn('[AuthService] Token already expired, no need to blacklist.');
        }
      } else {
        this.logger.warn('[AuthService] Invalid token or missing expiration, cannot blacklist.');
      }
    } catch (error) {
      this.logger.error(`[AuthService] Error blacklisting token:`, error);
      throw new Error('Failed to logout due to token processing error.');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    this.logger.debug(`[AuthService] Requesting password reset for email: ${email}`);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(`[AuthService] Password reset request for non-existent email: ${email}`);
      // No lanzar error para evitar enumeración de usuarios
      return;
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      JWT_RESET_SECRET as string,
      { expiresIn: '15m' } // Token válido por 15 minutos
    );

    // Guardar el token de reseteo en Redis con el usuario ID y un TTL
    // Esto asegura que el token solo se puede usar una vez y tiene un tiempo limitado
    await this.redisClient.setex(`passwordReset:${user.id}`, 900, resetToken); // 900 segundos = 15 minutos

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`; // URL de tu frontend
    await this.emailService.sendPasswordResetEmail(email, user.username, resetLink);
    this.logger.info(`[AuthService] Password reset link sent to ${email}`);
  }

  async resetPassword(resetData: IPasswordResetConfirmDTO): Promise<void> {
    this.logger.debug(`[AuthService] Attempting to reset password for email: ${resetData.email}`);
    const { token, email, newPassword } = resetData;

    try {
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET as string) as { userId: number };

      const user = await this.userRepository.findById(decoded.userId);
      if (!user || user.email !== email) {
        this.logger.warn(`[AuthService] Password reset failed: User not found or email mismatch for token.`);
        throw new Error('Invalid or expired password reset token.');
      }

      // Verificar que el token aún sea válido en Redis
      const storedToken = await this.redisClient.get(`passwordReset:${user.id}`);
      if (!storedToken || storedToken !== token) {
        this.logger.warn(`[AuthService] Password reset failed: Token not found in Redis or mismatch for user ${user.id}.`);
        throw new Error('Invalid or expired password reset token.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.update(user.id, { password: hashedPassword });

      // Eliminar el token de Redis para asegurar que no se pueda reutilizar
      await this.redisClient.del(`passwordReset:${user.id}`);

      this.logger.info(`[AuthService] Password successfully reset for user: ${email}`);
    } catch (error: any) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        this.logger.warn(`[AuthService] Password reset failed due to token issues: ${error.message}`);
        throw new Error('Invalid or expired password reset token.');
      }
      this.logger.error(`[AuthService] Error during password reset for ${email}:`, error);
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  }
}
