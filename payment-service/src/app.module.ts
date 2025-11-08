import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [PaymentModule,MongooseModule.forRoot('mongodb://localhost/payment-service')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
