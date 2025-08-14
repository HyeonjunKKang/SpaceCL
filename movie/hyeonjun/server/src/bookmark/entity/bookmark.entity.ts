import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  Unique,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Entity('bookmarks')
@Unique(['userId', 'movieId'])
@Index('idx_user_created', ['userId', 'createdAt'])
export class Bookmark {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  // ★ DB와 일치: INT UNSIGNED
  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId!: number;

  @Column({ name: 'movie_id', type: 'varchar', length: 32 })
  movieId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;
}
