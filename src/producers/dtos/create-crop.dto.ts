import { IsInt, IsString } from 'class-validator';

export class CreateCropDto {
  @IsString()
  name: string;

  @IsInt()
  harvestId: number;
}
