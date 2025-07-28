import {
  IRegisterDTO,
  ILoginDTO,
  IAuthResponse,
  IPasswordResetRequestDTO,
  IPasswordResetConfirmDTO,
} from "../../interfaces/IAuth.js";
import { User } from "@prisma/client";

export interface IAuthService {
  register(
    registerData: IRegisterDTO
  ): Promise<Partial<User & { role: { name: string } }>>;
  login(loginData: ILoginDTO): Promise<IAuthResponse>;
  logout(token: string): Promise<void>; // Nuevo método
  requestPasswordReset(email: string): Promise<void>; // Nuevo método
  resetPassword(resetData: IPasswordResetConfirmDTO): Promise<void>; // Nuevo método
}
