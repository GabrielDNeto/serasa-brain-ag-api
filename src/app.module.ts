import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ProducersModule } from './producers/producers.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, ProducersModule, PropertiesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
