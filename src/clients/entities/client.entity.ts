import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  dni?: string;

  @Column({ nullable: false })
  nationality: string;

  @Column({ type: 'date', nullable: false })
  dob: Date;

  @Column({ nullable: true })
  passport?: string;

  @ManyToMany(() => Booking, (booking) => booking.clients)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
