export class CreatePaymentDto {
  subscriptionId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
}
