import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { SupportMessage } from './support.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class SupportResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @ManyToOne(() => User, (user) => user.supportResponses)
  @JoinColumn()
  author: User;

  @ManyToOne(() => SupportMessage, (supportMessage) => supportMessage.responses)
  supportMessage: SupportMessage;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isInternal: boolean;
}
