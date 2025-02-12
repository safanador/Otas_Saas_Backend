import { IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNumber()
  agencyId: number;

  @IsNumber()
  planId: number;
}
