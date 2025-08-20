import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ResponseClientDto } from './dto/response-client.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('clients')
@UseGuards(PermissionsGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Permissions()
  create(@Body() createClientDto: CreateClientDto): Promise<ResponseClientDto> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @Permissions('list client')
  findAll(@Query('search') search?: string): Promise<ResponseClientDto[]> {
    return this.clientsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseClientDto> {
    return this.clientsService.findOne(+id);
  }

  @Put(':id')
  @Permissions('update client')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ResponseClientDto> {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  @Permissions('delete client')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(+id);
  }
}
