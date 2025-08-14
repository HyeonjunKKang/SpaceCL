// src/auth/decorators/current-user-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtUser } from '../type/jwt-user';

export const CurrentUserId = createParamDecorator((_d: unknown, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest<Request>();
  const user = req.user as unknown as JwtUser;
  return user.userId;
});
