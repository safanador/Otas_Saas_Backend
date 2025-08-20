import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { ResponseTourDto } from './dto/response-tour.dto';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('tours')
@UseGuards(PermissionsGuard)
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @Permissions()
  async create(
    @Body() createTourDto: CreateTourDto,
    @Req() req: RequestWithUser,
  ): Promise<ResponseTourDto> {
    return this.toursService.create(createTourDto, req.user.agencyId);
  }

  @Get()
  @Permissions()
  async findAllForAgency(
    @Req() req: RequestWithUser,
  ): Promise<ResponseTourDto[]> {
    return this.toursService.findAllForAgency(req.user.agencyId);
  }

  @Get(':id')
  @Permissions()
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<ResponseTourDto> {
    return this.toursService.findOne(+id, req.user.agencyId);
  }

  @Put(':id')
  @Permissions()
  async update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
    @Req() req: RequestWithUser,
  ): Promise<ResponseTourDto> {
    return this.toursService.update(+id, updateTourDto, req.user.agencyId);
  }

  @Delete(':id')
  @Permissions()
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    return this.toursService.remove(+id, req.user.agencyId);
  }
}
