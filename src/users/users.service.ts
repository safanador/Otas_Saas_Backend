import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MailsService } from 'src/mails/mails.service';
import { RolesService } from 'src/roles/roles.service';
import { AgenciesService } from 'src/agencies/agencies.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly RolesService: RolesService,
    private readonly agenciesService: AgenciesService,
    private readonly mailsService: MailsService,
  ) {}

  async create(createUserDto: CreateUserDto, resetUrl?: string) {
    const { agencyId, roleId } = createUserDto;

    const agency = await this.agenciesService.findOne(agencyId);
    if (!agency) {
      throw new BadRequestException('La agencia no existe en nuestro sistema.');
    }

    const role = await this.RolesService.findOne(roleId);
    if (!role) {
      throw new BadRequestException('El rol no existe en nuestro sistema.');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      agency,
      role,
    });
    console.log(newUser);
    try {
      await this.userRepository.save(newUser);
      // enviar correo electronico

      await this.mailsService.sendUserConfirmation(
        newUser.name,
        newUser.email,
        resetUrl,
      );

      return { message: ['Email sended', { newUser }] };
    } catch (error) {
      console.log(error);
    }
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findAll(agencyId?: number): Promise<User[]> {
    const whereCondition = agencyId ? { agency: { id: 1 } } : {};
    return await this.userRepository.find({
      where: whereCondition,
      relations: ['agency'],
    });
  }

  async findByAgencyId(agencyId: number): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { agency: { id: agencyId } },
      relations: ['agency'],
    });

    if (users.length === 0) {
      throw new NotFoundException('No se encontraron usuarios para la agencia');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    // Validar agencyId si se proporciona
    if (updateUserDto.agencyId) {
      const agency = await this.agenciesService.findOne(updateUserDto.agencyId);
      if (!agency) {
        throw new BadRequestException('La agencia no fue encontrada.');
      }
      user.agency = agency; // Asociar la nueva agencia al usuario
    }

    // Validar roleId si se proporciona
    if (updateUserDto.roleId) {
      const role = await this.RolesService.findOne(updateUserDto.roleId);
      if (!role) {
        throw new BadRequestException('El rol especificado no existe.');
      }
      user.role = role; // Asociar el nuevo rol al usuario
    }

    // actualizar user
    Object.assign(user, updateUserDto);

    try {
      const updatedUser = await this.userRepository.save(user);
      return {
        message: 'Usuario actualizado exitosamente',
        user: updatedUser,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Un error ha ocurrido al actualizar.');
    }
  }

  async toggleUserStatus(id: number): Promise<{ message: string; user: User }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    user.isActive = !user.isActive;
    await this.userRepository.save(user);

    const status = user.isActive ? 'activado' : 'desactivado';
    return {
      message: `Usuario ha sido ${status}`,
      user,
    };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    try {
      await this.userRepository.remove(user);
      return { message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al eliminar el usuario.');
    }
  }
}
