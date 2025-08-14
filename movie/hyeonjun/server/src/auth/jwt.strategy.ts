// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  type JwtFromRequestFunction,
  type StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';

// Authorization: Bearer <token> 에서 토큰 추출
const jwtFromAuthHeader: JwtFromRequestFunction = (req: Request) => {
  const auth = req.headers?.authorization;
  if (!auth) return null;
  const [scheme, token] = auth.split(' ');
  return /^Bearer$/i.test(scheme) && token ? token : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cs: ConfigService) {
    const options: StrategyOptionsWithoutRequest = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: jwtFromAuthHeader,
      secretOrKey: cs.getOrThrow<string>('JWT_SECRET'),
      ignoreExpiration: false,
    };
    super(options);
  }

  // src/auth/jwt.strategy.ts
  validate(payload: { sub?: number; id?: number; email?: string; name?: string }) {
    const id = payload.id ?? payload.sub!;
    return { userId: id, email: payload.email, name: payload.name }; // ← JwtUser
  }
}
