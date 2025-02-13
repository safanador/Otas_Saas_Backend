import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionService } from './subscriptions.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('subscriptions')
@UseGuards(PermissionsGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Permissions('create subscription') // Solo usuarios con este permiso pueden acceder
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Put(':id')
  @Permissions('update subscription') // Solo usuarios con este permiso pueden acceder
  async update(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @Permissions('delete subscription') // Solo usuarios con este permiso pueden acceder
  async cancel(@Param('id') id: number) {
    return this.subscriptionService.cancel(id);
  }

  @Get()
  @Permissions('list subscription') // Solo usuarios con este permiso pueden acceder
  async findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  @Permissions('show subscription') // Solo usuarios con este permiso pueden acceder
  async findOne(@Param('id') id: number) {
    return this.subscriptionService.findOne(id);
  }
}
