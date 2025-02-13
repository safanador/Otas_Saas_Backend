import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payments.service';
import { UpdatePaymentStatusDto } from './dto/update-payment.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('payments')
@UseGuards(PermissionsGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Permissions('create payment') // Solo usuarios con este permiso pueden acceder
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
  @Permissions('list payment') // Solo usuarios con este permiso pueden acceder
  async getPaymentsBySubscription(
    @Param('subscriptionId') subscriptionId: number,
  ) {
    return this.paymentService.getPaymentsBySubscription(subscriptionId);
  }

  @Put(':paymentId/status')
  @Permissions('update payment') // Solo usuarios con este permiso pueden acceder
  async updatePaymentStatus(
    @Param('paymentId') paymentId: number,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    const { status } = updatePaymentStatusDto;
    return this.paymentService.updatePaymentStatus(paymentId, status);
  }

  @Delete(':paymentId')
  @Permissions('delete payment') // Solo usuarios con este permiso pueden acceder
  async deletePayment(@Param('paymentId') paymentId: number) {
    return this.paymentService.deletePayment(paymentId);
  }
}
