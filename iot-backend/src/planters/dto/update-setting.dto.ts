import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsOptional()
  @IsNumber()
  ec: number;
  @IsOptional()
  @IsString()
  turnOn: string;
  @IsOptional()
  @IsString()
  turnOff: string;
}
