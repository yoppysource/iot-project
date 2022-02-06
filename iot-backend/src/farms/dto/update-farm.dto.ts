import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateFarmDto {
  @IsString()
  @IsOptional()
  location: string;
  @IsObject()
  @IsOptional()
  defaultSetting: {
    ec: number;
    turnOn: string;
    turnOff: string;
  };
}
