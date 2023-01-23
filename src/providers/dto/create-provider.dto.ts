import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateProviderDto {
  @ApiProperty({
    description: "Nombre del proveedor",
    example: "Proveedor 1",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Teléfono del proveedor",
    example: "999999999",
    required: false,
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: "Correo electrónico del proveedor",
    example: "provider@provider.com",
    required: false,
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: "Tipo de documento del proveedor",
    example: "RUC",
    enum: ["RUC", "DNI", "CE"],
  })
  @IsString()
  @IsIn(["RUC", "DNI", "CE"], {
    message: "El tipo de documento debe ser RUC, DNI ó CE",
  })
  @IsNotEmpty()
  documentType: string;

  @ApiProperty({
    description: "Número de documento del proveedor",
    example: "12345678901",
  })
  @IsString()
  @MinLength(8)
  @MaxLength(11)
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({
    description: "Dirección del proveedor",
    example: "Av. Siempre Viva 123",
    required: false,
  })
  @IsString()
  @IsOptional()
  address: string;
}
