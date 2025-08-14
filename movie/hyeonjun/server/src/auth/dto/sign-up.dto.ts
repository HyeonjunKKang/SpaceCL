// src/auth/dto/sign-up.dto.ts
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: '홍길동', maxLength: 32 })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  name!: string;

  @ApiProperty({ example: 'hong@example.com', maxLength: 128 })
  @IsEmail()
  @MaxLength(128)
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8, maxLength: 64 })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}
