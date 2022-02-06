import { IsNumber, IsString } from 'class-validator';

export class InitializePlanterDTO {
  @IsString()
  planterId: string;
  @IsString()
  farm: string;
  @IsString()
  publicIP: string;
  @IsNumber()
  numOfFloor: number;
  @IsNumber()
  port: number;
  @IsString()
  localIP: string;
}
