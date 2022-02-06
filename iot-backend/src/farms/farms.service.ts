import { Farm } from './../schemas/farm.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateFarmDto } from './dto/create-farm.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmsService {
  constructor(@InjectModel(Farm.name) private farmModel: Model<Farm>) {}
  async create(dto: CreateFarmDto, user: UserDocument) {
    const farm = new this.farmModel(dto);
    // user.farms.push(farm.id);
    await user.save();
    return farm.save();
  }

  async update(id: ObjectId, dto: UpdateFarmDto) {
    const farm = await this.farmModel.findById(id);
    if (!farm) throw new NotFoundException('farm not found');
    Object.assign(farm, dto);
    return farm.save();
  }

  async remove(id: ObjectId) {
    const farm = await this.farmModel.findById(id);
    if (!farm) throw new NotFoundException('farm not found');
    return farm.remove();
  }
}
