import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ResponseClientDto } from './dto/response-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ResponseClientDto> {
    const client = this.clientRepository.create(createClientDto);
    const savedClient = await this.clientRepository.save(client);
    return this.mapToDto(savedClient);
  }

  async findAll(search?: string): Promise<ResponseClientDto[]> {
    // Crear un query builder
    const queryBuilder = this.clientRepository.createQueryBuilder('client');

    // Si hay criterio de búsqueda, agregar condiciones WHERE
    if (search) {
      queryBuilder.where(
        'client.name LIKE :search OR client.email LIKE :search OR client.phone LIKE :search',
        { search: `%${search}%` },
      );
    }

    // Ejecutar la consulta
    const clients = await queryBuilder.getMany();

    // Mapear a DTO y retornar
    return clients.map((client) => this.mapToDto(client));
  }

  async findOne(id: number): Promise<ResponseClientDto> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return this.mapToDto(client);
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<ResponseClientDto> {
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    const updatedClient = await this.clientRepository.save(client);
    return this.mapToDto(updatedClient);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Client not found');
    }
  }

  private mapToDto(client: Client): ResponseClientDto {
    return {
      id: client.id,
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      dni: client.dni,
      nationality: client.nationality,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
