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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions('list user') // Solo usuarios con este permiso pueden acceder
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('show user') // Solo usuarios con este permiso pueden acceder
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Get('agency/:agencyId')
  @Permissions('list user') // Solo usuarios con este permiso pueden acceder
  async findUsersByAgencyId(@Param('agencyId') agencyId: number) {
    return this.usersService.findByAgencyId(agencyId);
  }

  @Patch(':id')
  @Permissions('update user') // Solo usuarios con este permiso pueden acceder
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/toggle-status')
  @Permissions('activate user') // Solo usuarios con este permiso pueden acceder
  async toggleUserStatus(@Param('id') id: number) {
    return this.usersService.toggleUserStatus(id);
  }

  @Delete(':id')
  @Permissions('delete user') // Solo usuarios con este permiso pueden acceder
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
