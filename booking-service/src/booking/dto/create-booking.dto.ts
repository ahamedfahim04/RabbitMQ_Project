import { IsNumber, IsString } from "class-validator";

export class CreateBookingDto {


  @IsString()
  userEmail: string;

  @IsString()
  flightId: string;

  @IsNumber()
  price: number;
}