import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPassword } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPassword,
  ) {
    return this.authService.sendPasswordResetToken(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPassword.token,
      resetPassword.newPassword,
    );
  }
}
