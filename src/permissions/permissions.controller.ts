import { Controller, Get, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('seed')
  async seedPermissions(): Promise<string> {
    await this.permissionsService.seedDefaultPermissions();
    return 'Default permissions seeded successfully.';
  }

  @Get()
  async getAll(): Promise<Permission[]> {
    return await this.permissionsService.getAllPermissions();
  }
}
