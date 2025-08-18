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
    // 1) 동적 화이트리스트: Vercel, 로컬, ngrok/trycloudflare 허용
    origin: (origin, callback) => {
      const whitelist = ['https://space-cl-ratx.vercel.app', 'http://localhost:5173'];
      // 개발 도구/서버 간 호출 등 origin이 없는 경우 허용
      if (!origin) return callback(null, true);

      const ok =
        whitelist.includes(origin) ||
        /\.ngrok-free\.app$/.test(origin) ||
        /\.trycloudflare\.com$/.test(origin);

      return ok ? callback(null, true) : callback(new Error('CORS blocked'));
    },

    // 2) 자주 쓰는 메서드/헤더 허용
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // 쿠키/인증 포함 시 필수
  });

  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
