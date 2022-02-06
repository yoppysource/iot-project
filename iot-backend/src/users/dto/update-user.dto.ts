import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsOptional()
  farms: Array<ObjectId>;
}
