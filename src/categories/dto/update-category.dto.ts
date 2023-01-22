import { PartialType, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateCategoryDto } from "./create-category.dto";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: "is_active",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
