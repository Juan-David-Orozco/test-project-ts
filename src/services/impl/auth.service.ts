import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { injectable, inject } from 'tsyringe';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../config/types.js'; 

import { JWT_SECRET } from "../../config/conf.js";
import { IAuthService } from '../interfaces/IAuthService.js';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository.js';
import { IRegisterDTO, ILoginDTO, IAuthResponse } from '../../interfaces/IAuth.js';
// Importamos el token del repositorio de usuarios del nuevo archivo tokens.ts
// import { USER_REPOSITORY } from '../../config/tokens.js';
// import { USER_REPOSITORY } from '../../config/container.js'; // Importamos el token del repositorio de usuarios
import { User } from '@prisma/client';

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.IUserRepository) private userRepository: IUserRepository) {} // Inyectamos el repositorio
  // private userRepository: IUserRepository
  // constructor(userRepository: IUserRepository) {
  //   this.userRepository = userRepository;
  // }

  async register(registerData: IRegisterDTO): Promise<Partial<User & { role: { name: string } }>> {
    const { username, email, password, role: roleName = 'user' } = registerData;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let role = await this.userRepository.findRoleByName(roleName);
    
    if (!role) {
      // Si el rol no existe, obtenemos todos los roles válidos para el mensaje de error
      const validRoles = await this.userRepository.getAllRoleNames();
      const roleList = validRoles.map((r:any) => `'${r}'`).join(', ');
      throw new Error(`Role '${roleName}' does not exist. Please choose from: ${roleList}.`);
    }

    const user = await this.userRepository.create(username, email, hashedPassword, role.id);
    return { id: user.id, username: user.username, email: user.email, role: { name: user.role.name } };
  }

  async login(loginData: ILoginDTO): Promise<IAuthResponse> {
    const { email, password } = loginData;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials. Email incorrect.");
    }
    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials. Password incorrect.");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.name },
      JWT_SECRET as string,
      { expiresIn: "2d" }
    );

    return { 
      user: { 
        id: user.id,
        username: user.username, 
        email: user.email,
        isActive: user.isActive,
        role: user.role.name 
      },
      token
    };  
  }  
}
