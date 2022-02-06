import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import MongooseClassSerializerInterceptor from 'src/intercepters/mongoose-serialize.interceptor';
import { Serialize } from 'src/intercepters/serialize.interceptor';
import { Role, User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LimitedTo } from './decorators/limited-to.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
  @Post('/signin')
  async signin(@Body() body: any, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    if (!user.isAllowed)
      throw new ForbiddenException('관리자의 승인이 나지 않은 계정입니다');
    session.userId = user.id;
    console.log(user);
    return user;
  }

  @Get('/:id')
  @LimitedTo(Role.Admin)
  findUser(@Param('id') id: ObjectId) {
    const user = this.usersService.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get()
  @LimitedTo(Role.Admin)
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  @LimitedTo(Role.Admin)
  deleteUser(@Param('id') id: ObjectId) {
    return this.usersService.remove(id);
  }

  @Patch('/:id')
  @LimitedTo(Role.Admin)
  updateUser(@Param('id') id: ObjectId, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
