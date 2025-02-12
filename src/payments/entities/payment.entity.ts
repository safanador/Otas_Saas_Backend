import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  paymentMethod: string; // Ejemplo: 'credit_card', 'paypal', etc.

  @Column({ type: 'varchar', length: 255, nullable: false })
  transactionId: string; // ID de la transacción en la pasarela de pagos

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string; // Ejemplo: 'pending', 'completed', 'failed'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date; // Fecha de vencimiento del pago (opcional)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
