import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [BookingModule,MongooseModule.forRoot('mongodb://localhost/booking-service')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
