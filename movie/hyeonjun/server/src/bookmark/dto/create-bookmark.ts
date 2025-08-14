// src/bookmark/dto/create-bookmark.dto.ts
import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty({
    example: 'MOV123',
    description: '영화 ID',
    minLength: 1,
    maxLength: 32,
  })
  @IsString()
  @Length(1, 32)
  movieId!: string;
}
