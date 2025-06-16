import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Producer } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponse } from 'src/types/pagination';
import { CreateProducerDto } from './dtos/create-producer.dto';

@Injectable()
export class ProducersService {
  constructor(private readonly prisma: PrismaService) {}

  async producers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProducerWhereUniqueInput;
    where?: Prisma.ProducerWhereInput;
    orderBy?: Prisma.ProducerOrderByWithRelationInput;
    page: number;
  }): Promise<PaginatedResponse<Producer>> {
    const { take, cursor, where, orderBy, page } = params;

    const limit = take || 10;

    const offset = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.producer.findMany({
        skip: offset,
        take: limit,
        cursor,
        where,
        orderBy,
      }),
      this.prisma.producer.count({
        where,
      }),
    ]);

    return {
      items: data,
      meta: {
        current: page,
        total,
      },
    };
  }

  async producer(
    producerWhereUniqueInput: Prisma.ProducerWhereUniqueInput,
  ): Promise<Producer | null> {
    return this.prisma.producer.findUnique({
      where: producerWhereUniqueInput,
      include: {
        properties: {
          where: {
            producer: producerWhereUniqueInput,
          },
          include: {
            harvests: {
              where: {
                property: {
                  producer: producerWhereUniqueInput,
                },
              },

              include: {
                crops: {
                  where: {
                    property: {
                      producer: producerWhereUniqueInput,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async producerInfo(
    producerWhereUniqueInput: Prisma.ProducerWhereUniqueInput,
  ): Promise<Producer | null> {
    return this.prisma.producer.findUnique({ where: producerWhereUniqueInput });
  }

  async createProducer(data: CreateProducerDto): Promise<Producer> {
    const producer = await this.producerInfo({ document: data.document });

    if (producer) {
      throw new ConflictException(
        `Já existe um produtor cadastrado com o cpfj/cnpj informado`,
      );
    }

    const createdProducer = await this.prisma.producer.create({
      data: {
        name: data.name,
        document: data.document,
        city: data.city,
        state: data.state,
      },
    });

    for (const property of data.properties) {
      const createdProperty = await this.prisma.property.create({
        data: {
          name: property.name,
          city: property.city,
          state: property.state,
          totalArea: property.totalArea,
          arableArea: property.arableArea,
          vegetationArea: property.vegetationArea,
          producerId: createdProducer.id,
        },
      });

      for (const harvest of property.harvests) {
        const createdHarvest = await this.prisma.harvest.create({
          data: {
            year: harvest.year,
            propertyId: createdProperty.id,
          },
        });

        for (const crop of harvest.crops) {
          await this.prisma.crop.create({
            data: {
              name: crop.name,
              propertyId: createdProperty.id,
              harvestId: createdHarvest.id,
            },
          });
        }
      }
    }

    return createdProducer;
  }

  async updateProducer(params: {
    where: Prisma.ProducerWhereUniqueInput;
    data: CreateProducerDto;
  }) {
    const { data, where } = params;

    const producer = await this.prisma.producer.findUnique({
      where,
      include: {
        properties: {
          include: {
            harvests: {
              include: {
                crops: true,
              },
            },
          },
        },
      },
    });

    const existsProducer = await this.prisma.producer.findUnique({
      where: {
        document: data.document,
      },
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado.');
    }

    if (existsProducer && where.id !== existsProducer.id)
      throw new ConflictException('Produtor já cadastrado com este CPF/CNPJ.');

    const updatedProducer = await this.prisma.producer.update({
      where,
      data: {
        name: data.name,
        document: data.document,
        city: data.city,
        state: data.state,
      },
    });

    for (const property of producer.properties) {
      for (const harvest of property.harvests) {
        await this.prisma.crop.deleteMany({
          where: { harvestId: harvest.id },
        });
      }

      await this.prisma.harvest.deleteMany({
        where: { propertyId: property.id },
      });
    }

    await this.prisma.property.deleteMany({
      where: { producerId: producer.id },
    });

    for (const property of data.properties) {
      const createdProperty = await this.prisma.property.create({
        data: {
          name: property.name,
          city: property.city,
          state: property.state,
          totalArea: property.totalArea,
          arableArea: property.arableArea,
          vegetationArea: property.vegetationArea,
          producer: {
            connect: { id: producer.id },
          },
        },
      });

      for (const harvest of property.harvests) {
        const createdHarvest = await this.prisma.harvest.create({
          data: {
            year: harvest.year,
            property: {
              connect: { id: createdProperty.id },
            },
          },
        });

        for (const crop of harvest.crops) {
          await this.prisma.crop.create({
            data: {
              name: crop.name,
              harvest: {
                connect: { id: createdHarvest.id },
              },
              property: {
                connect: { id: createdProperty.id },
              },
            },
          });
        }
      }
    }

    return updatedProducer;
  }

  async deleteProducer(
    where: Prisma.ProducerWhereUniqueInput,
  ): Promise<Producer> {
    const producer = await this.producer({ id: where.id });

    if (!producer) {
      throw new NotFoundException(
        `Producer with id ${where.id} does not exist`,
      );
    }

    await this.prisma.crop.deleteMany({
      where: {
        property: {
          producerId: producer.id,
        },
      },
    });

    await this.prisma.harvest.deleteMany({
      where: {
        crops: {
          every: {
            property: {
              producerId: producer.id,
            },
          },
        },
      },
    });

    await this.prisma.property.deleteMany({
      where: {
        producerId: producer.id,
      },
    });

    return this.prisma.producer.delete({
      where,
    });
  }
}
