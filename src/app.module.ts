import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailsModule } from './mails/mails.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'operators',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    MailsModule,
    RolesModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
