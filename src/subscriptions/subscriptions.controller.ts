import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  async cancel(@Param('id') id: number) {
    return this.subscriptionService.cancel(id);
  }

  @Get()
  async findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.subscriptionService.findOne(id);
  }
}
