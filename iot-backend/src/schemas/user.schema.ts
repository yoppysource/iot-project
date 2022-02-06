import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Farm } from './farm.schema';
import * as mongoose from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';

export enum Role {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
}
export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;
  @Prop()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Farm.name }] })
  @Type(() => Farm)
  farms: Farm[];

  @Prop()
  isAllowed: boolean;

  @Prop()
  role: Role;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
