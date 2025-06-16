import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';

@Module({
  controllers: [ProducersController],
  providers: [ProducersService, PrismaService],
})
export class ProducersModule {}
