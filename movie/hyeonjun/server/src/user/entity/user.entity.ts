// src/user/entity/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // 테이블명
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number; // -> users.id INT UNSIGNED AUTO_INCREMENT

  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  email!: string; // UNIQUE 인덱스와 매칭

  @Column({ type: 'varchar', length: 128, select: false })
  password!: string; // 조회 기본 제외: 로그인/검증 때만 명시적으로 가져옴

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;
}
