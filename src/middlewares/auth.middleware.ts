import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/conf.js";
// import { container } from 'tsyringe'; // Importamos el contenedor para resolver dependencias
import { container } from '../config/inversify.config.js'; // Importar el contenedor
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
// import { UserRepository } from '../repositories/impl/user.repository.js'; // Importar el repositorio concreto
import { TYPES } from '../config/types.js'; // Importar los tipos/símbolos
import prisma from '../config/prisma.js'; // Importar el cliente prisma directamente
// Importamos el token del repositorio del nuevo archivo tokens.ts
// import { USER_REPOSITORY } from '../config/tokens.js';
// import { USER_REPOSITORY } from '../config/container.js'; // Importamos el token del repositorio
import { IJwtPayload, IRequestUser } from '../interfaces/commons.js'; // Nuevas interfaces
// import { UserService } from '../services/impl/user.service.js';

// Extend the Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      // user?: { id: number; role: string; email: string; username: string };
      user?: IRequestUser; // Usamos la interfaz IRequestUser
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided!' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as IJwtPayload; // Usamos IJwtPayload
    // const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number; role: string; iat: number; exp: number };

    // // Resolvemos el repositorio de usuarios usando el contenedor
    // const userRepository = container.resolve<IUserRepository>(USER_REPOSITORY);
    // const user = await userRepository.findById(decoded.id)
    // const user = await UserService.findUserById(decoded.id); ???

    // Instanciar manualmente UserRepository aquí
    // const userRepository = new UserRepository(prisma); // Pasar el cliente prisma
    // const user = await userRepository.findById(decoded.id);

    // Resolver UserRepository desde el contenedor de InversifyJS
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const user = await userRepository.findById(decoded.id);    

    if (!user) {
      return res.status(403).json({ message: 'Access Denied: User not found!' });
    }

    req.user = { id: user.id, role: user.role.name, email: user.email, username: user.username };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Access Denied: Invalid token!' });
  }
};