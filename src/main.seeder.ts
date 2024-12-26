import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseSeeder } from './seeds/database.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(DatabaseSeeder);

  await seeder.run();
  console.log('Seeding finished successfully.');

  await app.close();
}

bootstrap();
