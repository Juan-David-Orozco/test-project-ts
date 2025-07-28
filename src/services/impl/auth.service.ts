import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { injectable, inject } from 'tsyringe';
import { injectable, inject } from "inversify";
import { TYPES } from "../../config/types.js";

// Ya no se inyectan directamente aquí (Se inyectan en el orquetador de Registro)
// import { IEmailService, ISmsService } from '../interfaces/INotificationService.js'; // Importar interfaces de notificación
import { RegistrationOrchestrator } from "./registration.orchestrator.js"; // Importar el orquestador
import { Logger } from "winston"; // Importar Logger de Winston

import { JWT_SECRET } from "../../config/conf.js";
import { IAuthService } from "../interfaces/IAuthService.js";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository.js";
import {
  IRegisterDTO,
  ILoginDTO,
  IAuthResponse,
} from "../../interfaces/IAuth.js";
// Importamos el token del repositorio de usuarios del nuevo archivo tokens.ts
// import { USER_REPOSITORY } from '../../config/tokens.js';
// import { USER_REPOSITORY } from '../../config/container.js'; // Importamos el token del repositorio de usuarios
import { User } from "@prisma/client";

@injectable()
export class AuthService implements IAuthService {
  private userRepository: IUserRepository;
  private logger: Logger;
  private registrationOrchestrator: RegistrationOrchestrator; // Declarar propiedad para el orquestador
  // private emailService: IEmailService;
  // private smsService: ISmsService;

  constructor(
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.RegistrationOrchestrator)
    registrationOrchestrator: RegistrationOrchestrator // Inyectar el orquestador
    // @inject(TYPES.IEmailService) emailService: IEmailService,
    // @inject(TYPES.ISmsService) smsService: ISmsService,
  ) {
    this.userRepository = userRepository;
    this.logger = logger; // Asignar el logger
    this.registrationOrchestrator = registrationOrchestrator;
    // this.emailService = emailService; // No se asignan
    // this.smsService = smsService; // No se asignan
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
      phoneNumber // Pasa el número de teléfono si lo tienes en IRegisterDTO
    );
    this.logger.info(`[AuthService] User registration process completed for: ${user.email}`);
    // this.logger.info(`User registered successfully: ${user.email} with role ${user.role.name}`);

    // try {
    //   await this.emailService.sendRegistrationEmail(user.email, user.username);
    //   this.logger.debug(`Registration email sent to ${user.email}`);
    //   // Asumimos que registerData.phoneNumber existe si quieres enviar SMS
    //   // if (registerData.phoneNumber) {
    //   //   await this.smsService.sendRegistrationSms(registerData.phoneNumber, user.username);
    //   // }
    //   // Por simplicidad, siempre se asume un número de teléfono de ejemplo por ahora.
    //   await this.smsService.sendRegistrationSms("+1234567890", user.username); // Usar un número de prueba
    //   this.logger.debug(
    //     `Registration SMS sent to +1234567890 for ${user.username}`
    //   );
    // } catch (notificationError) {
    //   // console.error(`Error sending notification for user ${user.email}:`, notificationError);
    //   this.logger.error(
    //     `Error sending notification for user ${user.email}:`,
    //     notificationError
    //   );
    //   // Decidir si este error debe impedir el registro o solo loguearse.
    //   // Por ahora, solo se loguea.
    // }

    return { id: user.id, username: user.username, email: user.email, role: { name: role.name } };

    // return {
    //   id: user.id,
    //   username: user.username,
    //   email: user.email,
    //   role: { name: user.role.name },
    // };
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
}
