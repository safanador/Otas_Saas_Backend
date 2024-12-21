import { Module } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { AgenciesController } from './agencies.controller';
import { Agency } from './entities/agency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Agency])], // Importa el repositorio de Agencia
  controllers: [AgenciesController],
  providers: [AgenciesService],
  exports: [TypeOrmModule], // Exporta para que otros módulos puedan usar el repositorio
})
export class AgenciesModule {}
