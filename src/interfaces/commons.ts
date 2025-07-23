// Type for the JWT payload after decoding
export interface IJwtPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

// Type for user data attached to request by auth middleware
export interface IRequestUser {
  id: number;
  role: string;
  email: string;
  username: string;
}