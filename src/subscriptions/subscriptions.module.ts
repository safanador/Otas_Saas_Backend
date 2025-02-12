import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionService } from './subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { PaymentsModule } from 'src/payments/payments.module';
import { Payment } from 'src/payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Agency, Plan, Payment]),
    forwardRef(() => PaymentsModule),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionsModule {}
