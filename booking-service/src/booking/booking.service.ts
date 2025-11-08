import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './entities/booking.entity';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBookingDto } from './dto/create-booking.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy,
  ) {}

  //  1️⃣ Create a new booking (HTTP flow)
  async createBooking(data: CreateBookingDto) {
    const newBooking = new this.bookingModel(data);
    const savedBooking = await newBooking.save();

    const payload = {
      bookingId: savedBooking._id, // ✅ Always send as string
      userEmail: data.userEmail,
      price: data.price,
      status: 'created',
    };

    // Publish event to Payment Service
    await lastValueFrom(this.paymentClient.emit('booking_created', payload));
    this.logger.log(`📤 booking_created event emitted for bookingId: ${savedBooking._id}`);

    return {
      message: 'Booking created successfully and event published.',
      data: savedBooking,
    };
  }

  //  2️⃣ Update booking status (RMQ event flow)
  async updateBookingStatus(bookingId: string, newStatus: string) {
    try {
      // Fetch current booking to show before/after status
      const existingBooking = await this.bookingModel.findById(bookingId);
      if (!existingBooking) {
        this.logger.warn(`⚠️ Booking not found for ID: ${bookingId}`);
        return null;
      }

      const oldStatus = existingBooking.status;
      const updatedBooking = await this.bookingModel.findByIdAndUpdate(
        bookingId,
        { status: newStatus },
        { new: true },
      );

      this.logger.log(
        `✅ Booking ${bookingId} status updated: ${oldStatus} → ${newStatus}`,
      );

      return updatedBooking;
    } catch (error) {
      this.logger.error(`❌ Error updating booking ${bookingId}:`, error);
      throw error;
    }
  }
}
