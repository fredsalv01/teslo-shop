import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateBrandDto {
  @ApiProperty({
    description: "Brand name",
    example: "Brand Name",
  })
  @IsString()
  @IsNotEmpty({ message: "El nombre de la marca es obligatorio" })
  name: string;

  @ApiProperty({
    description: "Branch id",
    example: 1,
  })
  @IsString()
  @IsOptional()
  branch: number;
}
