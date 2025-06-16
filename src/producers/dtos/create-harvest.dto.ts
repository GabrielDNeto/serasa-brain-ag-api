import { Type } from 'class-transformer';
import { IsInt, ValidateNested, IsArray } from 'class-validator';
import { CreateCropDto } from './create-crop.dto';

export class CreateHarvestDto {
  @IsInt()
  year: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCropDto)
  crops: CreateCropDto[];
}
