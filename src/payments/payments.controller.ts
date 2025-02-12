import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payments.service';
import { UpdatePaymentStatusDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { subscriptionId, amount, paymentMethod, transactionId, status } =
      createPaymentDto;
    return this.paymentService.createPayment(
      subscriptionId,
      amount,
      paymentMethod,
      transactionId,
      status,
    );
  }

  @Get('subscription/:subscriptionId')
  async getPaymentsBySubscription(
    @Param('subscriptionId') subscriptionId: number,
  ) {
    return this.paymentService.getPaymentsBySubscription(subscriptionId);
  }

  @Put(':paymentId/status')
  async updatePaymentStatus(
    @Param('paymentId') paymentId: number,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    const { status } = updatePaymentStatusDto;
    return this.paymentService.updatePaymentStatus(paymentId, status);
  }
}
