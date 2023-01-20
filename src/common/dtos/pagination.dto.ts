import { ApiProperty } from "@nestjs/swagger/dist";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: "limit of items per page",
    example: 15,
    default: 10,
  })
  // transformar
  @Type(() => Number) //enableImplicit Conversions: true
  limit?: number;

  @IsOptional()
  @Type(() => Number) //enableImplicit Conversions: true
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number) //enableImplicit Conversions: true
  @Min(0)
  @ApiProperty({
    description: "page number",
    example: 1,
    default: 1,
  })
  page?: number;
}
