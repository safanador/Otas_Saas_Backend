import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Agency } from '../../agencies/entities/agency.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Booking } from 'src/bookings/entities/booking.entity';

@Entity()
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  duration: string; // Ej: "5 días / 4 noches"

  @ManyToOne(() => Category, (category) => category.tours)
  @JoinTable({ name: 'tour_category' }) // Solo necesario en un lado de la relación
  category: Category;

  @Column('simple-json')
  itinerary: { day: number; description: string }[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Agency, (agency) => agency.tours)
  agency: Agency;

  @OneToMany(() => Booking, (booking) => booking.tour)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
