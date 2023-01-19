import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsPositive()
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
  page?: number;
}
