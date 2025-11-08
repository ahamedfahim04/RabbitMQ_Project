import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './entities/payment.enity';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { BookingCreatedDto } from './dto/create-payment.dto';
import { validateSync } from 'class-validator';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
  ) {}

  // Called by controller when booking_created event arrives.

  async handleBookingCreated(payload:any) {
    const dto =  plainToInstance(BookingCreatedDto,payload);
    const errors = validateSync(dto, {whitelist: true, forbidNonWhitelisted: true });

    if(errors.length > 0) {
      this.logger.error('Invalid booking_created payload', JSON.stringify(errors));
      throw new BadRequestException('Invalid booking_created payload');  
    }
    this.logger.log(`Received booking data from the booking-service`);

    // to save the payment details in the db
    const payment = new this.paymentModel({
      bookingId: dto.bookingId,
      userEmail: dto.userEmail,
      amount: dto.price,
      status: 'Success', // for demo, always success
    });

    await payment.save();
    this.logger.log(`Payment saved for booking ${dto.bookingId}`);

    // Prepare and emit payment_completed event
    const notifyPayload = {
      bookingId: dto.bookingId,
      userEmail: dto.userEmail,
      amount: dto.price,
      paymentStatus: 'Success',
      message: 'Payment completed successfully',
    };

    // Convert observable to promise to await publication
    await lastValueFrom(this.notificationClient.emit('payment_completed', notifyPayload));
    this.logger.log('📤 payment_completed event emitted to Notification Service');


  }

}
