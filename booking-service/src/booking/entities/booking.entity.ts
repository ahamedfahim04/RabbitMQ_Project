import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;
@Schema({timestamps: true})
export class Booking {

  @Prop({required: true})
  userEmail: string;

  @Prop({required: true})
  flightId: string;

  @Prop({required: true})
  price: number;

  @Prop({default: 'Pending'})
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);