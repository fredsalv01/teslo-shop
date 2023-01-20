import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsNumber()
  companyId: number;
}
