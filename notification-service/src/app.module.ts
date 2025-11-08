import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [NotificationModule,MongooseModule.forRoot('mongodb://localhost/notification-service')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
