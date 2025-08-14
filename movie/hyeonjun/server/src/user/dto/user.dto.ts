// src/user/dto/user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: '유저 ID' })
  id!: number;

  @ApiProperty({ example: '홍길동', description: '유저 이름' })
  name!: string;

  @ApiProperty({ example: 'hong@example.com', description: '유저 이메일' })
  email!: string;

  @ApiProperty({ example: '2025-08-12T09:00:00Z', description: '가입일' })
  createdAt!: Date;

  @ApiProperty({
    example: '2025-08-12T10:00:00Z',
    description: '마지막 업데이트일',
  })
  updatedAt!: Date;
}
