import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Farm, FarmSchema } from 'src/schemas/farm.schema';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Farm.name,
        schema: FarmSchema,
      },
    ]),
  ],
  controllers: [FarmsController],
  providers: [FarmsService],
})
export class FarmsModule {}
