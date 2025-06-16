import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async properties() {
    return this.prisma.property.findMany({
      include: {
        producer: true,
        harvests: {
          include: {
            crops: true,
          },
        },
      },
    });
  }
}
