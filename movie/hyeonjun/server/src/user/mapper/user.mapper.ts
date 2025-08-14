// src/user/mappers/user.mapper.ts
import { User } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';

export const toUserDto = (u: User): UserDto => ({
  id: u.id,
  name: u.name,
  email: u.email,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});
