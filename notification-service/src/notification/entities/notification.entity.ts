import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  bookingId: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentStatus: string;

  @Prop({ default: 'Not Sent' })
  notificationStatus: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
