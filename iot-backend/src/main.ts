import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { VersioningType } from '@nestjs/common';

process.env.TZ = 'Asia/Seoul';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:8081', 'http://127.0.0.1:8081'],
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_BROKER')],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: configService.get('KAFKA_API_KEY'),
          password: configService.get('KAFKA_API_SECRET'),
        },
      },
    },
  });
  await app.startAllMicroservices();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix("api/v1"); //edit your prefix as per your requirements!

  await app.listen(3000);
}
bootstrap();
