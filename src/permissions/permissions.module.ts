import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [TypeOrmModule], // Exportamos TypeOrmModule para que otros módulos puedan usar la entidad Permission
})
export class PermissionsModule implements OnModuleInit {
  constructor(private readonly permissionsService: PermissionsService) {}

  async onModuleInit() {
    await this.permissionsService.seedDefaultPermissions();
  }
}
