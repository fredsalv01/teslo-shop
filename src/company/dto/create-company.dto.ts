import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateCompanyDto {
  @ApiProperty({
    description: "Social reason",
    example: "Social Reason",
    minimum: 11,
  })
  @IsNotEmpty({ message: "Social reason is required" })
  @IsString()
  @Length(11, 11)
  socialReason: string;

  @ApiProperty({
    description: "Comercial name",
    example: "Comercial Name",
  })
  @IsNotEmpty({ message: "Comercial name is required" })
  @IsString()
  comercialName: string;

  @ApiProperty({
    description: "status",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: "Company Slug",
    example: "company-slug",
  })
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty({
    description: "Max users",
    example: 10,
  })
  @IsNotEmpty({ message: "Max users is required" })
  @IsNumber()
  maxUsers: number;
}
