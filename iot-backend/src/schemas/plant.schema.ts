import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type PlantDocument = Plant & Document;

@Schema()
export class Plant {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;
  @Prop()
  durationSeeding: number;
  @Prop()
  durationTransplanting: number;
  @Prop()
  durationFinalTransplanting: number;
  @Prop()
  durationConversion: number;
  @Prop()
  name: string;
  @Prop()
  plantId: string;
}

export interface QuantityForPeriod {
  readonly seeding: number;
  readonly transplanting: number;
  readonly finalTransplanting: number;
  readonly conversion: number;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);
