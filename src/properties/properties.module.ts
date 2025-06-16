import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PropertiesService, PrismaService],
  controllers: [PropertiesController],
})
export class PropertiesModule {}
