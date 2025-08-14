// src/bookmark/bookmark.controller.ts
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookmarkService } from './bookmark.service';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';
import { CreateBookmarkDto } from './dto/create-bookmark';
import { RemoveBookmarkDto } from './dto/remove-bookmark';

@Controller('bookmarks')
@UseGuards(AuthGuard('jwt'))
export class BookmarkController {
  constructor(private readonly service: BookmarkService) {}

  @Post('add')
  add(@CurrentUserId() userId: number, @Body() body: CreateBookmarkDto) {
    return this.service.add(userId, body.movieId);
  }

  @Delete()
  remove(@CurrentUserId() userId: number, @Body() body: RemoveBookmarkDto) {
    return this.service.remove(userId, body.movieId);
  }

  @Get(':movieId')
  async isBookmarked(@CurrentUserId() userId: number, @Param('movieId') movieId: string) {
    return this.service.isBookmarked(userId, movieId);
  }

  @Get()
  list(@CurrentUserId() userId: number) {
    return this.service.list(userId);
  }
}
