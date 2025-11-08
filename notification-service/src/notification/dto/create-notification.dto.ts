import { IsString, IsNumber } from 'class-validator';

export class PaymentCompletedDto {
  @IsString()
  bookingId: string;

  @IsString()
  userEmail: string;

  @IsNumber()
  amount: number;

  @IsString()
  paymentStatus: string;

  @IsString()
  message: string;
}
