import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // 🟢 Create HTTP Application
  const app = await NestFactory.create(AppModule);

  // 🌐 Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes extra fields not defined in DTO
      forbidNonWhitelisted: true, // Throws error for unwanted fields
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  // 🟣 Connect RabbitMQ Microservice for receiving events (like 'notification_sent')
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ URL
      queue: 'update_booking_queue',   // Queue to listen to (must match Notification emitter)
      queueOptions: {
        durable: true,                 // Keeps queue persistent after broker restarts
      },
    },
  });

  // 🚀 Start both HTTP and Microservice
  await app.startAllMicroservices();
  console.log('📡 Booking Service is now listening for notification_sent events via RabbitMQ');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Booking Service HTTP running on http://localhost:${port}`);
}

bootstrap();
