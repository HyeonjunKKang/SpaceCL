import type { BaseUser } from './user.type';

export class SignUpResultDto {
  id!: number;
  name!: string;
  email!: string;
}

export interface SignInResDto {
  user: BaseUser;
  accessToken: string;
}
