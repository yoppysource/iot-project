import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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
  await app.listen(3000);
}
bootstrap();
