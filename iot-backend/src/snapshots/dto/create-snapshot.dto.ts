export class CreateSnapshotDto {
  planter: string;
  planterId: string;
  date: Date;
  image: {
    data: Buffer;
    contentType: string;
  };
  temperature: number;
  humidity: number;
  lux: number;
  co2ppm: number;
  waterTemperature: number;
  ph: number;
  ec: number;
}
