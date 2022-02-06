import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/guards/roles.guard';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { CurrentUserMiddleWare } from './middlewares/current-user.middleware';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CurrentUserMiddleWare).forRoutes('*');
  }
}
