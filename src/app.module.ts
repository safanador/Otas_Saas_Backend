import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailsModule } from './mails/mails.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AgenciesModule } from './agencies/agencies.module';
import { DatabaseSeeder } from './seeds/database.seeder';
import { ImagesModule } from './images/images.module';
import { ConfigModule } from '@nestjs/config';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { SupportModule } from './support/support.module';
import { CategoriesModule } from './categories/categories.module';
import { ToursModule } from './tours/tours.module';
import { ClientsModule } from './clients/clients.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'operators',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    MailsModule,
    RolesModule,
    PermissionsModule,
    AgenciesModule,
    ImagesModule,
    PlansModule,
    SubscriptionsModule,
    PaymentsModule,
    SupportModule,
    CategoriesModule,
    ToursModule,
    ClientsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseSeeder],
})
export class AppModule {}
