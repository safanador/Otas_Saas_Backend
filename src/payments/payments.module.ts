import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './payments.controller';
import { PaymentService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Subscription]),
    forwardRef(() => SubscriptionsModule),
  ], // Registra aquí la entidad
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentsModule {}
