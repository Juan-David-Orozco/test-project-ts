// This can extend or be based on Prisma's generated types if desired
import { User, Role } from '@prisma/client';
import { z } from 'zod'; // Vamos a usar Zod para las validaciones aquí

// Interfaz base (viene de Prisma)
export interface IUser extends User {}

// DTO para la actualización de un usuario
// Aquí definiremos el esquema de Zod para validación
export const UserUpdateSchema = z.object({
  username: z.string().min(1, 'Username is required.').optional(),
  email: z.string().email('Invalid email format.').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long.').optional(),
  roleId: z.number().int('Role ID must be an integer.').positive('Role ID must be positive.').optional(),
}).strict(); // strict() para evitar propiedades no definidas

export type IUserUpdateDTO = z.infer<typeof UserUpdateSchema>;

// DTO para la creación de un usuario por un administrador
export const UserCreateByAdminSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  email: z.string().email('Invalid email format.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  roleName: z.string().min(1, 'Role name is required.').optional(), // Se espera el nombre del rol
}).strict();

export type IUserCreateByAdminDTO = z.infer<typeof UserCreateByAdminSchema>;


export type UserWithRole = User & { role: Role };

export interface IUserData {
  id: number;
  username: string;
  email: string;
  role: string;
}