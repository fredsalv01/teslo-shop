import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Social reason is required' })
  @IsString()
  @Length(11, 11)
  socialReason: string;

  @IsNotEmpty({ message: 'Comercial name is required' })
  @IsString()
  comercialName: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'Max users is required' })
  @IsNumber()
  maxUsers: number;
}
