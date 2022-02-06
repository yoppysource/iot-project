import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId, Types } from 'mongoose';
import { Farm } from './farm.schema';
import { PlantInPlanter } from './plant-in-planter.schema';

export type PlanterDocument = Planter & Document;
@Schema()
export class Planter {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;
  @Prop({ unique: true })
  planterId: string;
  @Prop({ type: Types.ObjectId, ref: Farm.name })
  @Transform(({ value }) => value.toString())
  farm: ObjectId; // before creation
  @Prop()
  numOfFloor: number;
  @Prop(
    raw({
      ec: Number,
      turnOn: String,
      turnOff: String,
    }),
  )
  setting: Setting; // Post creation
  @Prop(
    raw([
      {
        cameraId: String, // before createion
        floor: Number,
        localIP: String,
        publicIP: String,
        streamingPort: Number,
        webPort: Number,
        // Camera는 알 필요 없음  @Prop()
        plantId: String,
        transferredAt: String,
      },
    ]),
  )
  cameras: Array<Camera>; // Post Creation
  @Prop()
  publicIP: string; // before creation
  @Prop()
  port: number; // before creation
  @Prop()
  localIP: string; // before creation
  @Prop([{ type: Types.ObjectId, ref: 'PlantInPlanter' }])
  plantsInPlanter: Array<PlantInPlanter>;
  getUrl: (paths: string[]) => string;
}

export interface Setting {
  readonly ec: number;
  readonly turnOn: string;
  readonly turnOff: string;
}

export interface Camera {
  readonly cameraId: string;
  readonly floor: number;
  readonly publicIP: string; // before creation
  readonly webPort: number;
  readonly streamingPort: number;
  readonly localIP: string; // before creation
  readonly plantId?: string;
  readonly transferredAt?: Date;
}

export const PlanterSchema = SchemaFactory.createForClass(Planter);

PlanterSchema.methods.getUrl = function (
  this: PlanterDocument,
  paths: string[],
) {
  let pathSting = '';
  if (paths) paths.forEach((el: string) => (pathSting += `/${el}`));
  return `http://${this.publicIP}:${this.port}${pathSting}`;
};
