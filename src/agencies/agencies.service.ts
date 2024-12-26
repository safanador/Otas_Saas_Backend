import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './entities/agency.entity';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) {}

  async create(createAgenciaDto: CreateAgencyDto): Promise<Agency> {
    const agency = this.agencyRepository.create(createAgenciaDto);
    return this.agencyRepository.save(agency);
  }

  async findOne(id: number): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({ where: { id } });
    if (!agency) {
      throw new NotFoundException(`Agencia con ID ${id} no encontrada`);
    }
    return agency;
  }

  async findAll(): Promise<Agency[]> {
    const agencies = await this.agencyRepository.find();
    return agencies;
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {
    const agency = await this.findOne(id);
    const updatedAgency = this.agencyRepository.merge(agency, updateAgencyDto);
    return this.agencyRepository.save(updatedAgency);
  }

  async delete(id: number): Promise<void> {
    const agency = await this.findOne(id);
    await this.agencyRepository.remove(agency);
  }

  async toggleActiveState(
    id: number,
  ): Promise<{ message: string; agency: Agency }> {
    const agency = await this.findOne(id);
    if (!agency) {
      throw new NotFoundException('Agencia no encontrada');
    }

    agency.isActive = !agency.isActive;
    await this.agencyRepository.save(agency);

    const status = agency.isActive ? 'activada' : 'desactivada';
    return {
      message: `La agencia ha sido ${status}`,
      agency,
    };
  }
}
