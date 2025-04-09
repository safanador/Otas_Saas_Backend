import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Agency } from 'src/agencies/entities/agency.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { PaymentService } from 'src/payments/payments.service';
import { Payment } from 'src/payments/entities/payment.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const { agencyId, planId } = createSubscriptionDto;

    const agency = await this.agencyRepository.findOne({
      where: { id: agencyId },
    });
    const plan = await this.planRepository.findOne({ where: { id: planId } });

    if (!agency || !plan) {
      throw new BadRequestException('Agency or Plan not found');
    }

    const subscription = this.subscriptionRepository.create({
      agency,
      plan,
      startDate: new Date(),
      endDate: new Date(
        new Date().setDate(new Date().getDate() + plan.durationInDays),
      ),
      isActive: true,
    });

    const savedSubscription =
      await this.subscriptionRepository.save(subscription);

    // Solo crear un pago si el plan NO es un Free Trial
    if (!plan.isTrial) {
      await this.paymentService.createPayment(
        savedSubscription.id, // subscriptionId
        plan.price, // amount
        'credit_card', // paymentMethod
        'txn_123456', // transactionId
        'completed', // status
      );
    }

    return savedSubscription;
  }

  async update(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    await this.subscriptionRepository.update(id, updateSubscriptionDto);
    return this.subscriptionRepository.findOne({
      where: { id },
      relations: ['agency', 'plan', 'payments'],
    });
  }

  async cancel(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }

    subscription.isActive = !subscription.isActive;

    await this.subscriptionRepository.update(id, {
      isActive: subscription.isActive,
    });
    return subscription;
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      relations: ['agency', 'plan', 'payments'], // Incluye relaciones con Agency, Plan y Payments
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['agency', 'plan', 'payments'], // Incluye relaciones con Agency, Plan y Payments
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }

    return subscription;
  }
}
