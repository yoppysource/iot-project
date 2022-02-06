import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Farm } from 'src/schemas/farm.schema';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(dto: CreateUserDto) {
    const users = await this.usersService.find(dto.email);
    if (users.length) throw new BadRequestException('사용 중인 이메일입니다.');
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create(dto.email, result, dto.name);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService
      .find(email)
      .populate({ path: 'farms', model: Farm.name }); // just assign the first one

    if (!user) throw new NotFoundException('존재하지 않는 이메일입니다.');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('패스워드가 일치하지 않습니다');

    return user;
  }
}
