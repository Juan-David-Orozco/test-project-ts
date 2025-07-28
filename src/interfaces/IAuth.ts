import { z } from "zod"; // Vamos a usar Zod para las validaciones aquí

export const RegisterSchema = z.object({
  username: z.string().min(5, "Username is required."),
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  role: z.string().min(1, "Role name is required.").optional(), // Se espera el nombre del rol
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits long.").optional(),
});

export type IRegisterDTO = z.infer<typeof RegisterSchema>;

// export interface IRegisterDTO {
//   username: string;
//   email: string;
//   password: string;
//   role?: string;
//   phoneNumber?: string;
// }

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
})

export type ILoginDTO = z.infer<typeof LoginSchema>;

// export interface ILoginDTO {
//   email: string;
//   password: string;
// }

// Esquema Zod para solicitar reseteo de contraseña
export const PasswordResetRequestSchema = z.object({
  email: z.string().email('Invalid email format.'),
}).strict();

export type IPasswordResetRequestDTO = z.infer<typeof PasswordResetRequestSchema>;

// Esquema Zod para confirmar reseteo de contraseña
export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required.'),
  email: z.string().email('Email is required and must be a valid format.'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long.'),
}).strict();

export type IPasswordResetConfirmDTO = z.infer<typeof PasswordResetConfirmSchema>;

export interface IAuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  token: string;
}
