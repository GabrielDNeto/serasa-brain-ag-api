import { Controller, Get } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async getAllProperties() {
    return this.propertiesService.properties();
  }
}
