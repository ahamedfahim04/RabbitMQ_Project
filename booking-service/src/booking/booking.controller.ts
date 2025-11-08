import { Controller, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';


@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  async create(@Body() data: CreateBookingDto) {
    return this.bookingService.createBooking(data);
  }
}