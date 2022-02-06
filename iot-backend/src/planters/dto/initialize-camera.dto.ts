import { IsNumber, IsString } from 'class-validator';

export class InitializeCameraDTO {
  @IsString()
  cameraId: string;
  @IsString()
  publicIP: string;
  @IsNumber()
  webPort: number;
  @IsNumber()
  streamingPort: number;
  @IsNumber()
  floor: number;
  @IsString()
  localIP: string;
}
