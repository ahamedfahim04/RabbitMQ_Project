🧩 Services

    - Booking Service
    
          Accepts flight booking requests (user email, flight ID, price).
          
          Saves booking data to MongoDB.
          
          Publishes a booking_created event to RabbitMQ.
    
    - Payment Service
    
          Listens to booking_created events from RabbitMQ.
          
          Simulates payment processing and saves payment details.
          
          Emits a payment_completed event after payment success.
    
    - Notification Service
    
          Listens to payment_completed events.
          
          Simulates sending a confirmation notification (email/message).
          
          Emits notification_sent back to Booking Service.
          
          Updates the booking status to Completed after receiving notification_sent.

⚙️ Technologies Used

      NestJS – for structured, scalable backend development
      
      MongoDB – for storing booking and payment data
      
      RabbitMQ – for reliable message passing between microservices

🚀 How It Works

      User books a flight → Booking Service stores data → emits booking_created.
      
      Payment Service receives the event → processes payment → emits payment_completed.
      
      Notification Service receives it → sends confirmation → emits notification_sent.
      
      Booking Service updates the booking status to Completed.

🧠 Key Concepts

      Event-driven microservice architecture
      
      Inter-service communication using RabbitMQ
      
      Data persistence with MongoDB
