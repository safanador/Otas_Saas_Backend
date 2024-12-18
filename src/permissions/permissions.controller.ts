import { Controller, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('seed')
  async seedPermissions(): Promise<string> {
    await this.permissionsService.seedDefaultPermissions();
    return 'Default permissions seeded successfully.';
  }
}
