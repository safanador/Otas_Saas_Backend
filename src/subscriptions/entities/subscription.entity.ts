import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Payment } from 'src/payments/entities/payment.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Agency, (agency) => agency.subscriptions)
  @JoinColumn({ name: 'agencyId' })
  agency: Agency;

  @ManyToOne(() => Plan, (plan) => plan.agencies)
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];
}
