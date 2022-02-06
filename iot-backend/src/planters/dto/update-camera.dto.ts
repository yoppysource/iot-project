import { IsString } from 'class-validator';

export class UpdateCameraDTO {
  @IsString()
  plantId: string;
  @IsString()
  transferredAt: string;
}
