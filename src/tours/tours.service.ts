import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { ResponseTourDto } from './dto/response-tour.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { Agency } from 'src/agencies/entities/agency.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(
    createTourDto: CreateTourDto,
    agencyId: number,
  ): Promise<ResponseTourDto> {
    const category = await this.categoryService.findOne(
      parseInt(createTourDto.category),
    );

    const tour = this.tourRepository.create({
      ...createTourDto,
      agency: { id: agencyId } as Agency, // or fetch the agency entity if needed
      category: category, // ensure this is a single Category entity
    });

    const savedTour = await this.tourRepository.save(tour);
    return this.mapToDto(savedTour);
  }

  async findAllForAgency(agencyId: number): Promise<ResponseTourDto[]> {
    const tours = await this.tourRepository.find({
      where: { agency: { id: agencyId } },
      relations: ['agency', 'category'],
    });

    return tours.map((tour) => this.mapToDto(tour));
  }

  async findOne(id: number, agencyId: number): Promise<ResponseTourDto> {
    const tour = await this.tourRepository.findOne({
      where: { id, agency: { id: agencyId } },
      relations: ['agency', 'category'],
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    return this.mapToDto(tour);
  }

  async update(
    id: number,
    updateTourDto: UpdateTourDto,
    agencyId: number,
  ): Promise<ResponseTourDto> {
    const tour = await this.tourRepository.findOne({
      where: { id, agency: { id: agencyId } },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    const category = await this.categoryService.findOne(
      parseInt(updateTourDto.category),
    );

    const updatedTour = await this.tourRepository.save({
      ...tour,
      ...updateTourDto,
      agency: { id: agencyId } as Agency, // or fetch the agency entity if needed
      category: category,
    });

    return this.mapToDto(updatedTour);
  }

  async remove(id: number, agencyId: number): Promise<void> {
    const result = await this.tourRepository.delete({
      id,
      agency: { id: agencyId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Tour not found');
    }
  }

  private mapToDto(tour: Tour): ResponseTourDto {
    return {
      id: tour.id,
      name: tour.name,
      description: tour.description,
      price: tour.price,
      duration: tour.duration,
      category: tour.category,
      itinerary: tour.itinerary,
      isActive: tour.isActive,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
      agency: {
        id: tour.agency.id,
        name: tour.agency.name,
      },
    };
  }
}
