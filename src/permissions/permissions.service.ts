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
      'store user',
      'show user',
      'edit user',
      'update user',
      'delete user',
      'activate user',

      //role
      'list role',
      'create role',
      'store role',
      'show role',
      'edit role',
      'update role',
      'delete role',
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
}
