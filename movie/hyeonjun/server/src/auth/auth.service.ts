// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { DbErrorKind, parseDbError } from 'src/common/db/db-error';

type PublicUser = { id: number; name: string; email: string };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  private toPublic(u: User): PublicUser {
    return { id: u.id, name: u.name, email: u.email };
  }

  async signUp(dto: SignUpDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('이미 가입된 이메일입니다.');

    const entity = this.users.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    try {
      const saved = await this.users.save(entity);
      return this.toPublic(saved);
    } catch (e: any) {
      const { kind } = parseDbError(e);
      if (kind === DbErrorKind.Duplicate) throw new ConflictException('이미 가입된 이메일입니다.');
      throw new InternalServerErrorException('회원가입에 실패했습니다.');
    }
  }

  async signIn(dto: SignInDto): Promise<{ user: PublicUser; accessToken: string }> {
    const user = await this.users.findOne({
      where: { email: dto.email },
      select: ['id', 'name', 'email', 'password'],
    });

    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    const ok = user.password === dto.password;
    if (!ok) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    // payload는 최소화(권장: sub만 사용). 필요하면 name/email 포함 가능
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { user: this.toPublic(user), accessToken };
  }
}
