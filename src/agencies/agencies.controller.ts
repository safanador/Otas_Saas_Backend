import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { AgenciesService } from './agencies.service';

@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  async create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agenciesService.create(createAgencyDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.agenciesService.findOne(id);
  }

  @Get()
  findAll() {
    return this.agenciesService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    return this.agenciesService.update(id, updateAgencyDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.agenciesService.delete(id);
  }

  @Patch(':id/toggle-state')
  async toggleActiveState(@Param('id') id: number) {
    return this.agenciesService.toggleActiveState(id);
  }
}
