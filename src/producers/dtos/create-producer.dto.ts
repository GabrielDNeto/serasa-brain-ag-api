import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { CreatePropertyDto } from './create-property.dto';

export class CreateProducerDto {
  @IsString()
  name: string;

  @IsString()
  document: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyDto)
  properties: CreatePropertyDto[];
}
