import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmsService } from './farms.service';

@Controller('farms')
export class FarmsController {
  constructor(private farmsService: FarmsService) { }
  @Post()
  createFarm(@Body() body: CreateFarmDto, @CurrentUser() user: UserDocument) {
    return this.farmsService.create(body, user);
  }

  @Patch('/:id')
  updateFarm(@Param('id') id: ObjectId, @Body() body: UpdateFarmDto) {
    return this.farmsService.update(id, body);
  }
}
