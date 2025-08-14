// src/auth/dto/sign-in.dto.ts
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'hong@example.com',
    description: '회원 이메일',
    maxLength: 128,
  })
  @IsEmail()
  @MaxLength(128)
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}
