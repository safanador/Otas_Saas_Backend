import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
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
  phone2?: string;

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

  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  user: User;
}
