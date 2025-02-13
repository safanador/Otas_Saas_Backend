import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seedDefaultPermissions(): Promise<void> {
    const defaultPermissions = [
      //user
      'list user',
      'create user',
      'show user',
      'update user',
      'delete user',
      'activate user',

      //role
      'list role',
      'create role',
      'show role',
      'update role',
      'delete role',

      //agency
      'list agency',
      'create agency',
      'show agency',
      'update agency',
      'delete agency',
      'activate agency',

      //plan
      'list plan',
      'create plan',
      'show plan',
      'update plan',
      'delete plan',

      //subscription
      'list subscription',
      'create subscription',
      'show subscription',
      'update subscription',
      'delete subscription',

      //payment
      'list payment',
      'create payment',
      'show payment',
      'update payment',
      'delete payment',
    ];

    for (const description of defaultPermissions) {
      const exists = await this.permissionRepository.findOne({
        where: { description },
      });
      if (!exists) {
        const permission = this.permissionRepository.create({ description });
        await this.permissionRepository.save(permission);
      }
    }
  }

  async getAllPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }
}
