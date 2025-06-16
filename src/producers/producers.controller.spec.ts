/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';

describe('ProducersController', () => {
  let controller: ProducersController;
  let service: ProducersService;

  const mockService = {
    producers: jest.fn(),
    producer: jest.fn(),
    createProducer: jest.fn(),
    updateProducer: jest.fn(),
    deleteProducer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [{ provide: ProducersService, useValue: mockService }],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
    service = module.get<ProducersService>(ProducersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should call producers service with correct pagination and search params', async () => {
    await controller.getAllProducers('1', '10', 'john');
    expect(service.producers).toHaveBeenCalledWith({
      page: 1,
      take: 10,
      orderBy: { updatedAt: 'desc' },
      search: 'john',
    });
  });

  it('should call producer service with correct id', async () => {
    await controller.getProducerById('5');
    expect(service.producer).toHaveBeenCalledWith({ id: 5 });
  });

  it('should call createProducer service with producer data', async () => {
    const dto: CreateProducerDto = {
      name: 'João',
      document: '12345678900',
      city: 'Cidade X',
      state: 'SP',
      properties: [],
    };
    await controller.createProducer(dto);
    expect(service.createProducer).toHaveBeenCalledWith(dto);
  });

  it('should call updateProducer service with correct id and data', async () => {
    const dto: CreateProducerDto = {
      name: 'Maria',
      document: '98765432100',
      city: 'Cidade Y',
      state: 'RJ',
      properties: [],
    };
    await controller.updateProducer('2', dto);
    expect(service.updateProducer).toHaveBeenCalledWith({
      where: { id: 2 },
      data: dto,
    });
  });

  it('should call deleteProducer service with correct id', async () => {
    await controller.deleteProducer('7');
    expect(service.deleteProducer).toHaveBeenCalledWith({ id: 7 });
  });
});
