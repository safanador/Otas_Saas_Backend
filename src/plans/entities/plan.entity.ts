import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  durationInDays: number;

  @Column({ type: 'boolean', default: false })
  isTrial: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Agency, (agency) => agency.plan)
  agencies: Agency[];
}
