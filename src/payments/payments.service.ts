import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @Inject(forwardRef(() => SubscriptionService)) // 👈 Inyectar correctamente con forwardRef
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async createPayment(
    subscriptionId: number,
    amount: number,
    paymentMethod: string,
    transactionId: string,
    status: string,
  ): Promise<Payment> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const payment = this.paymentRepository.create({
      subscription,
      amount,
      paymentMethod,
      transactionId,
      status,
      paymentDate: new Date(),
    });

    return this.paymentRepository.save(payment);
  }

  async getPaymentsBySubscription(subscriptionId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { subscription: { id: subscriptionId } },
    });
  }

  async updatePaymentStatus(
    paymentId: number,
    status: string,
  ): Promise<Payment> {
    await this.paymentRepository.update(paymentId, { status });
    return this.paymentRepository.findOne({ where: { id: paymentId } });
  }

  async deletePayment(paymentId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }

    await this.paymentRepository.delete(paymentId);
    return payment;
  }
}
