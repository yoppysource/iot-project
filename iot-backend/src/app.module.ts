import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlantersModule } from './planters/planters.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { MongooseModule } from '@nestjs/mongoose';
import cookieSession = require('cookie-session');
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { FarmsModule } from './farms/farms.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.production`,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService
            .get<string>('DATABASE')
            .replace(
              'PASSWORD',
              configService.get<string>('DATABASE_PASSWORD'),
            ),
        };
      },
    }),
    PlantersModule,
    SnapshotsModule,
    UsersModule,
    FarmsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) { }
  // run for every incoming request
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
