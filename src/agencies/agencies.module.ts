import { Module } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { AgenciesController } from './agencies.controller';
import { Agency } from './entities/agency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, Role, User])], // Importa el repositorio de Agencia
  controllers: [AgenciesController],
  providers: [AgenciesService],
  exports: [TypeOrmModule, AgenciesService], // Exporta para que otros módulos puedan usar el repositorio
})
export class AgenciesModule {}
