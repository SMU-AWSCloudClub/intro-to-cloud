import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Intro to Cloud Deployment')
    .setDescription(
      "These are the backend APIs available for the intro to cloud deployment workshop's backend",
    )
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Todo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
