import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'El nombre de la categoría es obligatorio' })
  name: string;

  @IsString({ message: 'El slug de la categoría es obligatorio' })
  @IsOptional()
  slug: string;
}
