import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { AgenciesService } from './agencies.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('agencies')
@UseGuards(PermissionsGuard)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  @Permissions('create agency') // Solo usuarios con este permiso pueden acceder
  async create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agenciesService.create(createAgencyDto);
  }

  @Get(':id')
  @Permissions('show agency') // Solo usuarios con este permiso pueden acceder
  async findOne(@Param('id') id: number) {
    return this.agenciesService.findOne(id);
  }

  @Get()
  @Permissions('list agency') // Solo usuarios con este permiso pueden acceder
  findAll() {
    return this.agenciesService.findAll();
  }

  @Put(':id')
  @Permissions('update agency') // Solo usuarios con este permiso pueden acceder
  async update(
    @Param('id') id: number,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    return this.agenciesService.update(id, updateAgencyDto);
  }

  @Delete(':id')
  @Permissions('delete agency') // Solo usuarios con este permiso pueden acceder
  async delete(@Param('id') id: number) {
    return this.agenciesService.delete(id);
  }

  @Patch(':id/toggle-state')
  @Permissions('activate agency') // Solo usuarios con este permiso pueden acceder
  async toggleActiveState(@Param('id') id: number) {
    return this.agenciesService.toggleActiveState(id);
  }
}
