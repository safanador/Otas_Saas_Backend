import { IsString, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  subscriptionId: number;

  @IsNumber()
  amount: number;

  @IsString()
  paymentMethod: string;

  @IsString()
  transactionId: string;

  @IsString()
  status: string;
}
