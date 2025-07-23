import { IRegisterDTO, ILoginDTO, IAuthResponse } from '../../interfaces/IAuth.js';
import { User } from '@prisma/client';

export interface IAuthService {
  register(registerData: IRegisterDTO): Promise<Partial<User & { role: { name: string } }>>;
  login(loginData: ILoginDTO): Promise<IAuthResponse>;
}