import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { SupportMessage } from 'src/support/entities/support.entity';
import { Tour } from 'src/tours/entities/tour.entity';
@Entity('agencies')
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  countryCode?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone2?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  countryCode2?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url?: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  rnt: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.agency)
  users: User[];

  @OneToMany(() => Role, (role) => role.agency)
  roles: Role[];

  @ManyToOne(() => Plan, (plan) => plan.agencies)
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @OneToMany(() => Subscription, (subscription) => subscription.agency)
  subscriptions: Subscription[];

  @OneToMany(() => SupportMessage, (supportMessage) => supportMessage.agency)
  supportMessages: SupportMessage[];

  @OneToMany(() => Tour, (tour) => tour.agency)
  tours: Tour[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
