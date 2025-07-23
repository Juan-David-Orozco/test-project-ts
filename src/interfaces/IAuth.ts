export interface IRegisterDTO {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface ILoginDTO {
  email: string;
  password: string;
}

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