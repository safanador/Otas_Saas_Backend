import { Module } from '@nestjs/common';
import { PlanController } from './plans.controller';
import { PlanService } from './plans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])], // Registra el repositorio aquí
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlansModule {}
