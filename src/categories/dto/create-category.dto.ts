import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {

  @IsString({ message: 'El nombre es obligatorio'})
  name: string;

  @IsString({ message: '' })
  @IsOptional()
  description: string;
}
