import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailsService } from 'src/mails/mails.service';
import { ForgotPassword } from './dto/forgot-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailsService: MailsService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('El usuario ya existe');
    }
    return await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email incorrecto');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: user.email };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }

  async sendPasswordResetToken({ email }: ForgotPassword) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const payload = { email: email };

    const resetToken = await this.jwtService.signAsync(payload);

    const resetUrl = `${process.env.DOMAIN}/ota/auth/reset-password?token=${resetToken}`;

    try {
      await this.mailsService.sendResetToken(user.name, user.email, resetUrl);
      return { message: 'Email sended' };
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'No se pudo completar la acción, intenta más tarde.',
      );
    }
  }

  async resetPassword(token: string, newPassword: string) {
    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Token inválido o expirado');
    }

    // 2. Encuentra al usuario
    const user = await this.usersService.findOneByEmail(decoded.email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 3. Update password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await this.usersService.update(user.id, { password: hashedPassword });
    console.log(user.id);
    return { message: 'Contraseña actualizada correctamente' };
  }
}
