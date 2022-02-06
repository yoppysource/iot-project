import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Role, User, UserDocument } from 'src/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  create(email: string, password: string, name: string) {
    const user = new this.userModel({
      email,
      password,
      isAllowed: false,
      name,
      role: Role.User,
    });

    return user.save();
  }

  findOne(id: ObjectId) {
    if (!id) return null;
    return this.userModel.findById(id); // return one or null
  }

  find(email: string) {
    return this.userModel.find({ email }); // array or empty array
  }

  async update(id: ObjectId, attrs: UpdateUserDto) {
    // By not using update method, it could be enchained with middleware.
    const user = await this.userModel.findById(id);
    // This might cost adaptability to using more than one controller to using other protocol i.e grpg
    // If it needs, you can use exception filter to overcome the problem
    if (!user) throw new NotFoundException('user not found');
    Object.assign(user, attrs);
    return user.save();
  }

  async remove(id: ObjectId) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('user not found');
    return user.remove();
  }
}
