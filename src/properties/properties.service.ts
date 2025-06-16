import { Injectable } from '@nestjs/common';
import { Prisma, Property } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  properties(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PropertyWhereUniqueInput;
    where?: Prisma.PropertyWhereInput;
    orderBy?: Prisma.PropertyOrderByWithRelationInput;
  }): Promise<Property[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.property.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
