import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Agency } from 'src/agencies/entities/agency.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Agency, User]),
    PermissionsModule, // Importamos el módulo para usar la entidad Permission
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [TypeOrmModule, RolesService], // Exportamos TypeOrmModule para que otros módulos puedan usar la entidad Role
})
export class RolesModule {}
