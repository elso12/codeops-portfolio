export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  refreshTokenHash: string | null;
  createdAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash' | 'refreshTokenHash'>;
