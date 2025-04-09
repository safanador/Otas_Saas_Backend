import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = this.planRepository.create(createPlanDto);
    return this.planRepository.save(plan);
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    await this.planRepository.update(id, updatePlanDto);
    return this.planRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  async findOne(id: number): Promise<Plan> {
    return this.planRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { id: id },
    });

    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }

    await this.planRepository.delete(id);
    return plan;
  }
}
