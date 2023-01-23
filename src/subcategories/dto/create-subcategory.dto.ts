import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
export class CreateSubcategoryDto {
  @ApiProperty({
    description: "Subcategory name",
    example: "Subcategory name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Subcategory slug",
    example: "subcategory-slug",
  })
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: "Subcategory status",
    example: "true",
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    description: "Subcategory category id",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
