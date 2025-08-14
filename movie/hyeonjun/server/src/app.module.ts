import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';

import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { Bookmark } from './bookmark/entity/bookmark.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '3306'),
        username: config.get<string>('DB_USERNAME')!,
        password: config.get<string>('DB_PASSWORD')!,
        database: config.get<string>('DB_NAME')!,
        entities: [User, Bookmark],
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
