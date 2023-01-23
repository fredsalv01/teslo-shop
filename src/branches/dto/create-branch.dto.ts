import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger/dist";

export class CreateBranchDto {
  @ApiProperty({
    description: "Branch name",
    example: "Branch Name",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Branch slug",
    example: "branch-slug",
  })
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty({
    description: "Branch CompanyId",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  company: number;
}
