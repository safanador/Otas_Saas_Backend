import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanService } from './plans.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  async create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  @Get()
  async findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.planService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.planService.remove(id);
  }
}
