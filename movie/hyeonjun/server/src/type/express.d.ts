// src/types/express.d.ts
import { JwtUser } from '../auth/types/jwt-user';

declare global {
  namespace Express {
    type User = JwtUser;
  }
}

export {};
