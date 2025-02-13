import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanService } from './plans.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('plans')
@UseGuards(PermissionsGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @Permissions('create plan') // Solo usuarios con este permiso pueden acceder
  async create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Put(':id')
  @Permissions('update plan') // Solo usuarios con este permiso pueden acceder
  async update(@Param('id') id: number, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  @Get()
  @Permissions('list plan') // Solo usuarios con este permiso pueden acceder
  async findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  @Permissions('show plan') // Solo usuarios con este permiso pueden acceder
  async findOne(@Param('id') id: number) {
    return this.planService.findOne(id);
  }

  @Delete(':id')
  @Permissions('delete plan') // Solo usuarios con este permiso pueden acceder
  async remove(@Param('id') id: number) {
    return this.planService.remove(id);
  }
}
