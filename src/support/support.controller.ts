import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SupportMessageService } from './support.service';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { AddSupportResponseDto } from './dto/add-support-response.dto';
import { UpdateSupportStatusDto } from './dto/update-support.dto';
import { ResponseSupportMessageDto } from './dto/response-support-message.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';
import { ResponseSupportResponseDto } from './dto/response-support-response.dto';

@Controller('support')
@UseGuards(PermissionsGuard)
export class SupportMessageController {
  constructor(private readonly supportService: SupportMessageService) {}

  @Post()
  @Permissions()
  async create(
    @Body() createDto: CreateSupportMessageDto,
    @Req() req: RequestWithUser,
  ): Promise<ResponseSupportMessageDto> {
    return this.supportService.create(
      createDto,
      req.user.id,
      req.user.agencyId,
    );
  }

  @Post(':id/responses')
  @Permissions()
  async addResponse(
    @Param('id') id: string,
    @Body() addResponseDto: AddSupportResponseDto,
    @Req() req: RequestWithUser,
  ): Promise<ResponseSupportResponseDto> {
    return this.supportService.addResponse(
      +id,
      addResponseDto,
      req.user.id,
      false, // isInternal
    );
  }

  @Get()
  @Permissions()
  async findAllForAgency(
    @Req() req: RequestWithUser,
  ): Promise<ResponseSupportMessageDto[]> {
    return this.supportService.findAllForAgency(req.user.agencyId);
  }

  @Get(':id')
  @Permissions()
  async findOneForAgency(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<ResponseSupportMessageDto> {
    return this.supportService.findOneForAgency(+id, req.user.agencyId);
  }

  @Delete(':id')
  @Permissions()
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    return this.supportService.remove(+id, req.user.agencyId, req.user.id);
  }

  // Admin endpoints
  @Get('admin/all')
  @Permissions()
  async findAll(): Promise<ResponseSupportMessageDto[]> {
    return this.supportService.findAll();
  }

  @Get('admin/:id')
  @Permissions()
  async findOne(@Param('id') id: string): Promise<ResponseSupportMessageDto> {
    return this.supportService.findOne(+id);
  }

  @Post('admin/:id/internal-notes')
  @Permissions()
  async addInternalNote(
    @Param('id') id: string,
    @Body() addResponseDto: AddSupportResponseDto,
    @Req() req: RequestWithUser,
  ): Promise<ResponseSupportResponseDto> {
    return this.supportService.addResponse(
      +id,
      addResponseDto,
      req.user.id,
      true, // isInternal
    );
  }

  @Put('admin/:id/status')
  @Permissions()
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateSupportStatusDto,
    @Req() req: RequestWithUser,
  ): Promise<ResponseSupportMessageDto> {
    return this.supportService.updateStatus(+id, updateStatusDto, req.user.id);
  }
}
