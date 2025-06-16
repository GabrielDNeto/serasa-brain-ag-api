import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProducersService } from './producers.service';

describe('ProducersService', () => {
  let service: ProducersService;

  const mockPrisma = {
    producer: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    property: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    harvest: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    crop: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a producer with related data', async () => {
    mockPrisma.producer.findUnique.mockResolvedValue(null);
    mockPrisma.producer.create.mockResolvedValue({ id: 1 });
    mockPrisma.property.create.mockResolvedValue({ id: 10 });
    mockPrisma.harvest.create.mockResolvedValue({ id: 100 });
    mockPrisma.crop.create.mockResolvedValue({});

    const mockDto = {
      name: 'Produtor',
      document: '12345678900',
      city: 'Cidade',
      state: 'SP',
      properties: [
        {
          name: 'Fazenda A',
          city: 'Cidade',
          state: 'SP',
          totalArea: 100,
          arableArea: 70,
          vegetationArea: 30,
          harvests: [
            {
              year: 2024,
              crops: [{ name: 'Soja' }, { name: 'Milho' }],
            },
          ],
        },
      ],
    };

    const result = await service.createProducer(mockDto);
    expect(result).toEqual({ id: 1 });
    expect(mockPrisma.producer.create).toHaveBeenCalled();
    expect(mockPrisma.property.create).toHaveBeenCalled();
    expect(mockPrisma.harvest.create).toHaveBeenCalled();
    expect(mockPrisma.crop.create).toHaveBeenCalledTimes(2);
  });

  it('should throw ConflictException if producer already exists', async () => {
    mockPrisma.producer.findUnique.mockResolvedValue({ id: 1 });

    await expect(
      service.createProducer({
        name: 'Produtor',
        document: '12345678900',
        city: 'Cidade',
        state: 'SP',
        properties: [],
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return producer with nested data', async () => {
    const mockProducer = { id: 1, name: 'João' };
    mockPrisma.producer.findUnique.mockResolvedValue(mockProducer);

    const result = await service.producer({ id: 1 });
    expect(result).toEqual(mockProducer);
    expect(mockPrisma.producer.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: expect.any(Object),
    });
  });

  it('should delete producer and related data', async () => {
    mockPrisma.producer.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.crop.deleteMany.mockResolvedValue({});
    mockPrisma.harvest.deleteMany.mockResolvedValue({});
    mockPrisma.property.deleteMany.mockResolvedValue({});
    mockPrisma.producer.delete.mockResolvedValue({ id: 1 });

    const result = await service.deleteProducer({ id: 1 });
    expect(result).toEqual({ id: 1 });
  });

  it('should throw NotFoundException if producer does not exist', async () => {
    mockPrisma.producer.findUnique.mockResolvedValue(null);

    await expect(service.deleteProducer({ id: 1 })).rejects.toThrow(
      NotFoundException,
    );
  });
});
