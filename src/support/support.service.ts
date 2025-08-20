import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Relation, Repository } from 'typeorm';
import { SupportMessage } from './entities/support.entity';
import { SupportResponse } from './entities/support-response.entity';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { AddSupportResponseDto } from './dto/add-support-response.dto';
import { UpdateSupportStatusDto } from './dto/update-support.dto';
import { ResponseSupportMessageDto } from './dto/response-support-message.dto';
import { ResponseSupportResponseDto } from './dto/response-support-response.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SupportMessageService {
  constructor(
    @InjectRepository(SupportMessage)
    private readonly supportMessageRepository: Repository<SupportMessage>,
    @InjectRepository(SupportResponse)
    private readonly supportResponseRepository: Repository<SupportResponse>,
  ) {}

  async create(
    createDto: CreateSupportMessageDto,
    userId: number,
    agencyId: number,
  ): Promise<ResponseSupportMessageDto> {
    const supportMessage = this.supportMessageRepository.create({
      subject: createDto.subject,
      initialMessage: createDto.initialMessage,
      status: 'pending',
      createdBy: { id: userId },
      agency: { id: agencyId },
    });

    const savedMessage =
      await this.supportMessageRepository.save(supportMessage);
    return this.mapToSupportMessageDto(savedMessage);
  }

  async addResponse(
    messageId: number,
    addResponseDto: AddSupportResponseDto,
    userId: number,
    isInternal = false,
  ): Promise<ResponseSupportResponseDto> {
    const supportMessage = await this.supportMessageRepository.findOne({
      where: { id: messageId },
    });

    if (!supportMessage) {
      throw new NotFoundException('Support message not found');
    }

    if (supportMessage.status === 'closed') {
      throw new BadRequestException('Cannot add response to closed ticket');
    }

    const response = this.supportResponseRepository.create({
      message: addResponseDto.message,
      author: { id: userId },
      supportMessage: { id: messageId },
      isInternal,
    });

    // Actualizar estado del ticket
    if (!isInternal) {
      supportMessage.status = isInternal ? supportMessage.status : 'answered';
      await this.supportMessageRepository.save(supportMessage);
    }

    const savedResponse = await this.supportResponseRepository.save(response);
    return this.mapToSupportResponseDto(savedResponse);
  }

  async findAllForAgency(
    agencyId: number,
  ): Promise<ResponseSupportMessageDto[]> {
    const messages = await this.supportMessageRepository.find({
      where: { agency: { id: agencyId } },
      relations: ['createdBy', 'agency', 'responses', 'responses.author'],
      order: { createdAt: 'DESC' },
    });

    return messages.map((message) => this.mapToSupportMessageDto(message));
  }

  async findOneForAgency(
    id: number,
    agencyId: number,
  ): Promise<ResponseSupportMessageDto> {
    const message = await this.supportMessageRepository.findOne({
      where: { id, agency: { id: agencyId } },
      relations: [
        'createdBy',
        'agency',
        'responses',
        'responses.author',
        'closedBy',
      ],
    });

    if (!message) {
      throw new NotFoundException('Support message not found');
    }

    return this.mapToSupportMessageDto(message);
  }

  async remove(id: number, agencyId: number, userId: number): Promise<void> {
    const message = await this.supportMessageRepository.findOne({
      where: { id, agency: { id: agencyId } },
      relations: ['createdBy'],
    });

    if (!message) {
      throw new NotFoundException('Support message not found');
    }

    if (message.createdBy.id !== userId) {
      throw new ForbiddenException(
        'You can only delete your own support messages',
      );
    }

    await this.supportMessageRepository.remove(message);
  }

  // Admin methods
  async findAll(): Promise<ResponseSupportMessageDto[]> {
    const messages = await this.supportMessageRepository.find({
      relations: [
        'createdBy',
        'agency',
        'responses',
        'responses.author',
        'closedBy',
      ],
      order: { createdAt: 'DESC' },
    });

    return messages.map((message) => this.mapToSupportMessageDto(message));
  }

  async findOne(id: number): Promise<ResponseSupportMessageDto> {
    const message = await this.supportMessageRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'agency',
        'responses',
        'responses.author',
        'closedBy',
      ],
    });

    if (!message) {
      throw new NotFoundException('Support message not found');
    }

    return this.mapToSupportMessageDto(message);
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateSupportStatusDto,
    userId: number,
  ): Promise<ResponseSupportMessageDto> {
    const message = await this.supportMessageRepository.findOne({
      where: { id },
      relations: ['createdBy', 'agency'],
    });

    if (!message) {
      throw new NotFoundException('Support message not found');
    }

    if (updateStatusDto.status === 'closed') {
      message.closedBy = { id: userId } as Relation<User>;
      message.closedAt = new Date();
    }

    message.status = updateStatusDto.status;
    const updatedMessage = await this.supportMessageRepository.save(message);
    return this.mapToSupportMessageDto(updatedMessage);
  }

  private mapToSupportMessageDto(
    message: SupportMessage,
  ): ResponseSupportMessageDto {
    return {
      id: message.id,
      subject: message.subject,
      initialMessage: message.initialMessage,
      status: message.status,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      closedAt: message.closedAt,
      agency: {
        id: message.agency.id,
        name: message.agency.name,
      },
      createdBy: {
        id: message.createdBy.id,
        name: message.createdBy.name,
        email: message.createdBy.email,
      },
      closedBy: message.closedBy
        ? {
            id: message.closedBy.id,
            name: message.closedBy.name,
            email: message.closedBy.email,
          }
        : undefined,
      responses:
        message.responses?.map((response) =>
          this.mapToSupportResponseDto(response),
        ) || [],
    };
  }

  private mapToSupportResponseDto(
    response: SupportResponse,
  ): ResponseSupportResponseDto {
    return {
      id: response.id,
      message: response.message,
      isInternal: response.isInternal,
      createdAt: response.createdAt,
      author: {
        id: response.author.id,
        name: response.author.name,
        email: response.author.email,
      },
    };
  }
}
