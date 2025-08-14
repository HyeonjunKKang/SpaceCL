// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiOperation({ summary: 'sign up', description: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입에 성공하였습니다' })
  @ApiResponse({ status: 404, description: '회원가입에 실패하였습니다' })
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.auth.signUp(dto); // { id, name, email }
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.auth.signIn(dto); // { user, accessToken }
  }
}
