import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProducersModule } from './producers/producers.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, ProducersModule, PropertiesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
