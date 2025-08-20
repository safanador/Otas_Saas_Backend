import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Tour } from 'src/tours/entities/tour.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './enums/booking-status.enum';
import { Client } from 'src/clients/entities/client.entity';
import { BookingSource } from './enums/booking-source.enum';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(Tour)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Client)
    private readonly clientService: ClientsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId?: number,
    source: BookingSource = BookingSource.WEB,
  ) {
    return this.bookingRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // 1. Verificar tour
        const tour = await transactionalEntityManager.findOne(Tour, {
          where: { id: createBookingDto.tourId },
        });
        if (!tour) throw new NotFoundException('Tour not found');

        // 2. Manejo del cliente
        let client: Client;

        if (createBookingDto.clientId) {
          // Caso 1: Cliente existente por ID
          client = await transactionalEntityManager.findOne(Client, {
            where: { id: createBookingDto.clientId },
          });
          if (!client) {
            throw new NotFoundException(
              `Client with ID ${createBookingDto.clientId} not found`,
            );
          }
        } else if (createBookingDto.clientInfo) {
          // Caso 2: Crear nuevo cliente
          client = await transactionalEntityManager.save(Client, {
            ...createBookingDto.clientInfo,
            createdBy: userId ? { id: userId } : null,
          });
        } else {
          throw new BadRequestException(
            'Either clientId or clientInfo must be provided',
          );
        }

        // 3. Obtener usuario creador (si existe)
        const user = userId
          ? await transactionalEntityManager.findOne(User, {
              where: { id: userId },
            })
          : null;

        // 4. Calcular precio total
        const totalPrice = tour.price * createBookingDto.participants;

        // 5. Crear y guardar booking
        const booking = transactionalEntityManager.create(Booking, {
          ...createBookingDto,
          tour,
          client, // Asignar el cliente encontrado/creado
          createdByUser: user,
          totalPrice,
          source,
          status: createBookingDto.status || BookingStatus.PENDING,
          // Eliminar campos que no van a la tabla bookings
          clientId: undefined,
          clientInfo: undefined,
        });

        const savedBooking = await transactionalEntityManager.save(booking);
        return savedBooking;
      },
    );
  }

  async findAllForUser(userId: number) {
    const bookings = await this.bookingRepository.find({
      where: { createdByUser: { id: userId } },
      relations: ['tour'],
    });

    return bookings;
  }

  async findAllForAgency(agencyId: number) {
    console.log(agencyId);
    const bookings = await this.bookingRepository.find({
      where: { tour: { agency: { id: agencyId } } },
      relations: ['tour'],
    });

    return bookings;
  }

  async findOne(id: number, userId: number, isAdmin = false) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['tour', 'createdByUser'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    const isCreator = booking.createdByUser?.id === userId;

    // Verificar permisos
    if (!isAdmin && !isCreator) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return booking;
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
    userId: number,
    isAdmin = false,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['createdByUser'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    const isCreator = booking.createdByUser?.id === userId;
    // Solo el dueño o admin puede actualizar
    if (!isAdmin && !isCreator) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    const updatedBooking = await this.bookingRepository.save({
      ...booking,
      ...updateBookingDto,
    });

    return updatedBooking;
  }

  async cancel(id: number, userId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['createdByUser'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.createdByUser.id !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    booking.status = BookingStatus.CANCELLED;
    const updatedBooking = await this.bookingRepository.save(booking);
    return updatedBooking;
  }
}
