import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPassword } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response, //habilita respuesta manipulable
  ) {
    const { token, user } = await this.authService.login(loginDto);

    //configuración de cookie
    res.cookie('authToken', token, {
      httpOnly: true, // no accesible desde JS
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict', // mitigación csrf
      maxAge: 60 * 60 * 1000, // 1hr
    });
    return { message: 'Inicio de sesión exitoso', user };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPassword,
  ) {
    return this.authService.sendPasswordResetToken(forgotPasswordDto);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    try {
      res.clearCookie('authToken');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error clearing cookie:', error);
      return res.status(400).json({ message: 'Logout error' });
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPassword.token,
      resetPassword.newPassword,
    );
  }
}
