import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('booking_created')
  async handleBookingCreated(@Payload() data: any) {
    // Delegates to service which validates and processes
    await this.paymentService.handleBookingCreated(data);
  }
}
