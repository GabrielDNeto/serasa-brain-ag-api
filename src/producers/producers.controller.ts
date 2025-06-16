import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Producer } from '@prisma/client';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { ProducersService } from './producers.service';

@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Get()
  async getAllProducers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSizer') pageSize: string,
  ) {
    return this.producersService.producers({
      page: Number(pageNumber),
      take: Number(pageSize),
      orderBy: { updatedAt: 'desc' },
    });
  }

  @Get(':id')
  async getProducerById(@Param('id') id: string) {
    return this.producersService.producer({ id: Number(id) });
  }

  @Post('create')
  async createProducer(
    @Body() producerData: CreateProducerDto,
  ): Promise<Producer> {
    return this.producersService.createProducer(producerData);
  }

  @Put(':id')
  async updateProducer(
    @Param('id') id: string,
    @Body() producerData: CreateProducerDto,
  ): Promise<Producer> {
    return this.producersService.updateProducer({
      where: { id: Number(id) },
      data: producerData,
    });
  }

  @Delete(':id')
  async deleteProducer(@Param('id') id: string) {
    return this.producersService.deleteProducer({ id: Number(id) });
  }
}
