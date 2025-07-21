import bcrypt from "bcrypt";
import { UserService } from "./user.service.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/conf.js";

export class AuthService {
  static async register(
    username: string,
    email: string,
    passwordPlain: string,
    roleName: string = "user"
  ) {
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const user = await UserService.createUser(
      username,
      email,
      passwordPlain,
      roleName
    );
    return user;
  }

  static async login(email: string, passwordPlain: string) {
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials. Email incorrect.");
    }
    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(passwordPlain, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials. Password incorrect.");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.name },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      token,
    };
  }
  
}
