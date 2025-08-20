import { Agency } from 'src/agencies/entities/agency.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Role } from 'src/roles/entities/role.entity';
import { SupportResponse } from 'src/support/entities/support-response.entity';
import { SupportMessage } from 'src/support/entities/support.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  corporateEmail: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    default: 'en',
  })
  preferredLanguage: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true, default: '57' })
  countryCode: string;

  @ManyToOne(() => Agency, (agency) => agency.users, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  agency: Agency | null;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    onDelete: 'SET NULL',
  })
  role: Role;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => SupportMessage, (supportMessage) => supportMessage.createdBy)
  supportMessages: SupportMessage[];

  @OneToMany(() => SupportResponse, (response) => response.author)
  supportResponses: SupportResponse[];

  @OneToMany(() => Booking, (booking) => booking.createdByUser)
  bookings: Booking[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
