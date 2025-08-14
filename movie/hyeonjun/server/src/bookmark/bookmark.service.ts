// src/bookmark/bookmark.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entity/bookmark.entity';
import { DbErrorKind, parseDbError } from 'src/common/db/db-error';

@Injectable()
export class BookmarkService {
  constructor(@InjectRepository(Bookmark) private readonly repo: Repository<Bookmark>) {}

  async add(userId: number, movieId: string) {
    try {
      const entity = this.repo.create({ userId, movieId });
      return await this.repo.save(entity);
    } catch (e: any) {
      const { kind } = parseDbError(e);
      console.log(e);
      if (kind === DbErrorKind.Duplicate) throw new ConflictException('이미 등록된 영화입니다.');
      throw e;
    }
  }

  async remove(userId: number, movieId: string) {
    const res = await this.repo.delete({ userId, movieId });
    if (res.affected === 0) throw new NotFoundException('북마크가 없습니다.');
    return { ok: true };
  }

  async isBookmarked(userId: number, movieId: string) {
    try {
      const exists = await this.repo.findOne({ where: { userId, movieId } });
      if (exists) {
        return { isBookmarked: true };
      } else {
        return { isBookmarked: false };
      }
    } catch (e: any) {
      throw e;
    }
  }

  async list(userId: number) {
    try {
      const res = await this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
      return res;
    } catch (error) {
      throw error;
    }
  }
}
