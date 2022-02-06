import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

enum PlantStatus {
  Seed = 'seed',
  Sprout = 'sprout',
  Bloom = 'bloom',
  Mature = 'mature',
}
@Schema()
export class Seed extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Plant' })
  plant: ObjectId;
  @Prop()
  quantity: number;
  @Prop()
  createdAt: Date;
  @Prop()
  status: PlantStatus;
  @Prop()
  note: string;
}

export const SeedSchema = SchemaFactory.createForClass(Seed);
