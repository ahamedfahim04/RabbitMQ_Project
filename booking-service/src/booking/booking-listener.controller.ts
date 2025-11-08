import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';

@Controller()
export class BookingListenerController {
  private readonly logger = new Logger(BookingListenerController.name);

  constructor(private bookingService: BookingService) {}

  @EventPattern('notification_sent')
  async handleNotificationSent(@Payload() data: any) {
    this.logger.log(`📩 Received notification_sent for bookingId: ${data.bookingId}`);
    await this.bookingService.updateBookingStatus(data.bookingId, 'Completed');
  }
}
