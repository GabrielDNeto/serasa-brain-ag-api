/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;

  const mockPropertiesService = {
    properties: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockPropertiesService,
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    service = module.get<PropertiesService>(PropertiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProperties', () => {
    it('should return all properties', async () => {
      const mockData = [{ id: 1, name: 'Fazenda Exemplo' }];
      mockPropertiesService.properties.mockResolvedValue(mockData);

      const result = await controller.getAllProperties();

      expect(service.properties).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
});
