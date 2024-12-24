import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.contans';
import { MailsService } from 'src/mails/mails.service';
import { RolesModule } from 'src/roles/roles.module';
import { AgenciesModule } from 'src/agencies/agencies.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    AgenciesModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailsService],
})
export class AuthModule {}
