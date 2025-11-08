import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PaymentCompletedDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,

    @Inject('BOOKING_SERVICE')
    private bookingClient: ClientProxy, // 👈 connect to Booking Service
  ) {}

  async handlePaymentCompleted(data: PaymentCompletedDto) {
    this.logger.log(`📩 Received message from payment-service`);

    const notification = new this.notificationModel({
      bookingId: data.bookingId,
      userEmail: data.userEmail,
      amount: data.amount,
      paymentStatus: data.paymentStatus,
      notificationStatus: 'Sent',
    });

    await notification.save();
    this.logger.log(`✅ Notification saved for ${data.userEmail}`);

    // Emit event to Booking Service to mark as completed
    const payload = {
      bookingId: data.bookingId,
      status: 'Completed',
    };

    await lastValueFrom(this.bookingClient.emit('notification_sent', payload));
    this.logger.log(`📤 notification_sent event emitted for booking ${data.bookingId}`);
  }
}
