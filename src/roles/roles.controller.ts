import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions('create role') // Solo usuarios con este permiso pueden acceder
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions('list role') // Solo usuarios con este permiso pueden acceder
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('show role') // Solo usuarios con este permiso pueden acceder
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('update role') // Solo usuarios con este permiso pueden acceder
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions('delete role') // Solo usuarios con este permiso pueden acceder
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
