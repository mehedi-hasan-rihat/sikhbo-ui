export type UserRole = "STUDENT" | "MENTOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Shape of POST /auth/register and POST /auth/login responses
export interface AuthTokenResponse {
  success: boolean;
  message: string;
  data: { token: string };
}

// Shape of GET /auth/me response
export interface MeResponse {
  success: boolean;
  message: string;
  data: User;
}

// Decoded JWT payload (client-side use only — never trust for auth)
export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
