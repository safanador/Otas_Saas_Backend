import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { roleScope } from 'src/roles/enums/role.enum';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';
import { BookingSource } from './enums/booking-source.enum';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('bookings')
@UseGuards(PermissionsGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Permissions()
  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: RequestWithUser,
  ) {
    return this.bookingsService.create(
      createBookingDto,
      req.user.id,
      BookingSource.AGENCY,
    );
  }

  @Permissions()
  @Post('public')
  async createPublic(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(
      createBookingDto,
      undefined,
      BookingSource.WEB,
    );
  }

  @Permissions()
  @Get()
  async findAllForUser(@Req() req: RequestWithUser) {
    return this.bookingsService.findAllForUser(req.user.id);
  }

  @Permissions()
  @Get('agency')
  async findAllForAgency(@Req() req: RequestWithUser) {
    return this.bookingsService.findAllForAgency(req.user.agencyId);
  }

  @Permissions()
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.bookingsService.findOne(
      +id,
      req.user.id,
      req.user.scope === roleScope.GLOBAL,
    );
  }

  @Permissions()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: RequestWithUser,
  ) {
    return this.bookingsService.update(
      +id,
      updateBookingDto,
      req.user.id,
      req.user.scope === roleScope.GLOBAL,
    );
  }

  @Permissions()
  @Delete(':id')
  async cancel(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.bookingsService.cancel(+id, req.user.id);
  }
}
