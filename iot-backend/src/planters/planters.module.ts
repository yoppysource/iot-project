import { ControlService } from './control.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlantersController } from './planters.controller';
import { PlantersService } from './planters.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Planter, PlanterSchema } from 'src/schemas/planter.schema';
import { Farm, FarmSchema } from 'src/schemas/farm.schema';

@Module({
  imports: [
    // For root -> 종속된 모듈 전역에 쓸 수 있음
    // For Feature -> 이 한 모듈만 사용 가능
    MongooseModule.forFeature([
      {
        name: Planter.name,
        schema: PlanterSchema,
      },
      {
        name: Farm.name,
        schema: FarmSchema,
      },
    ]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [PlantersController],
  providers: [PlantersService, ControlService],
  exports: [ControlService],
})
export class PlantersModule {}
