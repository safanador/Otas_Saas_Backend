import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailsService: MailsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save(newUser);
      // enviar correo electronico
      await this.mailsService.sendUserConfirmation(newUser.name, newUser.email);
      return { message: 'Email sended' };
    } catch (error) {
      console.log(error);
    }
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // actualizar user
    Object.assign(user, updateUserDto);
    try {
      const updatedUser = await this.userRepository.save(user);
      return {
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
    //return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
