import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    description: "Category name",
    example: "Category Name",
  })
  @IsString({ message: "El nombre de la categoría es obligatorio" })
  name: string;

  @ApiProperty({
    description: "Category slug",
    example: "category-slug",
  })
  @IsString({ message: "El slug de la categoría es obligatorio" })
  @IsOptional()
  slug: string;
}
