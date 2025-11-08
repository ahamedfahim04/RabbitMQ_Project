import { IsString, IsNumber } from 'class-validator';

export class BookingCreatedDto {
  @IsString()
  bookingId: string;

  @IsString()
  userEmail: string;

  @IsNumber()
  price: number;

  @IsString()
  status: string;
}
