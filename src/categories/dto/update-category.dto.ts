import { PartialType, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateCategoryDto } from "./create-category.dto";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: "isActive",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
