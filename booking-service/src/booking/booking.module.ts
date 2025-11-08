import { Module } from '@nestjs/common';
import { BookingController} from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './entities/booking.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { BookingListenerController } from './booking-listener.controller';


@Module({
  imports: [RabbitMQModule, MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema}])],
  controllers: [BookingController, BookingListenerController],
  providers: [BookingService]
})
export class BookingModule {}
