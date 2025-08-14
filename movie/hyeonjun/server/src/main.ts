import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('Auth & Bookmarks')
    .setVersion('1.0.0')
    .addBearerAuth() // Authorization: Bearer <token>
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드 제거
      forbidNonWhitelisted: true, // DTO 밖 필드가 오면 400
      transform: true, // 타입 변환
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173', // React 개발 서버 주소
    credentials: true, // 쿠키/인증 헤더 허용 여부
  });

  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
