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
