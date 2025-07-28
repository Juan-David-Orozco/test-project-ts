import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/conf.js";
import { container } from '../config/inversify.config.js'; // Importar el contenedor
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import { TYPES } from '../config/types.js'; // Importar los tipos/símbolos
import { IJwtPayload, IRequestUser } from '../interfaces/commons.js'; // Nuevas interfaces
import Redis from 'ioredis'; // Importar Redis

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
    // Verificar si el token está en la lista negra de Redis
    const redisClient = container.get<Redis>(TYPES.RedisClient);
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Access Denied: Revoked token.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as IJwtPayload; // Usamos IJwtPayload
    // const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number; role: string; iat: number; exp: number };

    // Resolver UserRepository desde el contenedor de InversifyJS
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const user = await userRepository.findById(decoded.id);    

    if (!user) {
      return res.status(403).json({ message: 'Access Denied: User not found!' });
    }

    req.user = { id: user.id, role: user.role.name, email: user.email, username: user.username };
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access Denied: Expired token..' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Access Denied: Invalid token!' });
    }
    return res.status(500).json({ message: 'Error de autenticación inesperado.', error: error.message });
    // return res.status(403).json({ message: 'Access Denied: Invalid token!' });
  }
};