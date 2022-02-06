import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

enum PlantStatus {
  Seed = 'seed',
  Sprout = 'sprout',
  Bloom = 'bloom',
  Mature = 'mature',
}
@Schema()
export class PlantInPlanter extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Plant' })
  plant: ObjectId;
  @Prop()
  floor: number;
  @Prop({ type: Types.ObjectId, ref: 'Seed' })
  seed: ObjectId;
  @Prop()
  quantity: number;
  @Prop()
  createdAt: Date;
  @Prop()
  status: PlantStatus;
  @Prop()
  note: string;
}

export const PlantInPlanterSchema =
  SchemaFactory.createForClass(PlantInPlanter);
