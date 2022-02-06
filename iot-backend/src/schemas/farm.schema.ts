import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Setting } from './planter.schema';
import { Plant, PlantSchema } from './plant.schema';
import { Expose, Exclude, Transform } from 'class-transformer';

export type FarmDocument = Farm & Document;

@Schema()
export class Farm {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;
  @Prop()
  @Exclude()
  location: string;
  @Prop(
    raw({
      ec: Number,
      turnOn: String,
      turnOff: String,
    }),
  )
  defaultSetting: Setting;
  @Prop()
  plants: Array<Plant>;
  @Prop()
  isPrivate: boolean;
}

export const FarmSchema = SchemaFactory.createForClass(Farm);
