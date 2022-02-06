import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Planter } from './planter.schema';

export type SnapshotDocument = Snapshot & Document;

@Schema()
export class Snapshot {
  @Prop()
  planterId: string;
  @Prop()
  plantId: string;
  @Prop()
  cameraId: string;
  @Prop()
  createdAt: Date;
  @Prop()
  transferredAt: Date;
  @Prop()
  floor: number;
  @Prop()
  imageUrl: string;
  @Prop()
  numOfPixel: number;
  @Prop()
  temperature: number;
  @Prop()
  humidity: number;
  @Prop()
  lux: number;
  @Prop()
  co2ppm: number;
  @Prop()
  waterTemperature: number;
  @Prop()
  ph: number;
  @Prop()
  ec: number;
}

export const SnapshotSchema = SchemaFactory.createForClass(Snapshot);
