import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
//import { Role } from './role.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
