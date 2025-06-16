/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    property: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('properties', () => {
    it('should return a list of properties with related data', async () => {
      const mockResult = [
        {
          id: 1,
          name: 'Fazenda Alpha',
          producer: { id: 1, name: 'João' },
          harvests: [
            {
              id: 1,
              year: 2023,
              crops: [{ id: 1, name: 'Milho' }],
            },
          ],
        },
      ];

      mockPrismaService.property.findMany.mockResolvedValue(mockResult);

      const result = await service.properties();

      expect(prisma.property.findMany).toHaveBeenCalledWith({
        include: {
          producer: true,
          harvests: {
            include: {
              crops: true,
            },
          },
        },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
