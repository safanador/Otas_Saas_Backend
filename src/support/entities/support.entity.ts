import { Agency } from 'src/agencies/entities/agency.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Relation,
} from 'typeorm';
import { SupportResponse } from './support-response.entity';

@Entity()
export class SupportMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column('text')
  initialMessage: string; // Cambiado de 'message' a 'initialMessage'

  @Column({ default: 'pending' })
  status: 'pending' | 'answered' | 'closed' | 'in_progress'; // Estado ampliado

  @ManyToOne(() => User, (user) => user.supportMessages)
  @JoinColumn()
  createdBy: User;

  @ManyToOne(() => Agency, (agency) => agency.supportMessages)
  @JoinColumn()
  agency: Agency;

  @OneToMany(() => SupportResponse, (response) => response.supportMessage, {
    cascade: true,
  })
  responses: SupportResponse[]; // Nueva relación para múltiples respuestas

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  closedAt: Date; // Nueva columna para tracking de cierre

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'closed_by_id' }) // Especifica nombre de columna
  closedBy?: Relation<User>; // Usa Relation de typeorm
}
