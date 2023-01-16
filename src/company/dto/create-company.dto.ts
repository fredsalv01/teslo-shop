import {
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
  @Length(55, 55)
  comercialName: string;

  @IsOptional()
  @IsString()
  @Length(14, 14)
  status: string;

  @IsNotEmpty({ message: 'Slug is required' })
  @IsString()
  @Length(55, 55)
  slug: string;

  @IsNotEmpty({ message: 'Max users is required' })
  @IsNumber()
  maxUsers: number;
}
