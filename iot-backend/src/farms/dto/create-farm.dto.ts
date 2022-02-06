import { IsBoolean, IsObject, IsString } from 'class-validator';

export class CreateFarmDto {
  @IsString()
  location: string;
  @IsObject()
  defaultSetting: {
    ec: number;
    turnOn: string;
    turnOff: string;
  };
  @IsBoolean()
  isPrivate: boolean;
}
