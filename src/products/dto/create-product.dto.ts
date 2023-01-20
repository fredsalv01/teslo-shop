import { ApiProperty } from "@nestjs/swagger/dist";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    description: "Product title",
    example: "Product Title",
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: "Product price",
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @ApiProperty({
    description: "Product description",
    example: "Product description",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Product slug",
    example: "product-slug",
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: "Product sku",
    example: "123456789",
  })
  @IsString()
  sku: string;

  @ApiProperty({
    description: "Product available",
    example: 1,
    default: 1,
  })
  @IsNumber()
  available: number;

  @ApiProperty({
    description: "Product images",
    example: ["image1.jpg", "image2.jpg"],
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
