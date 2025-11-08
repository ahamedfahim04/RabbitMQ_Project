import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create a microservice instead of an HTTP server
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ connection URL
      queue: 'booking_queue',          // The same queue your BookingService emits to
      queueOptions: {
        durable: true,                 // Ensures the queue persists after restarts
      },
    },
  });

  await app.listen();
  console.log('💳 Payment Service is listening to booking_queue (RabbitMQ)');
}

bootstrap();
