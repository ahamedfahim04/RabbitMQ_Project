import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {

  @Prop({required: true})
  bookingId: string;

  @Prop({required: true})
  userEmail: string;

  @Prop({required: true})
  amount: number;

  @Prop({default: 'Pending' })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);