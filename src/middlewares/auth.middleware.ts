import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/conf.js";
import { UserService } from '../services/user.service.js';

// Extend the Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string; email: string; username: string };
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
    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number; role: string; iat: number; exp: number };
    const user = await UserService.findUserById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'Access Denied: User not found!' });
    }

    req.user = { id: user.id, role: user.role.name, email: user.email, username: user.username };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Access Denied: Invalid token!' });
  }
};