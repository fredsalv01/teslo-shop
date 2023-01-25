import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ValidRoles } from "../interfaces";

export class CreateUserDto {
  @ApiProperty({
    description: "Fullname",
    example: "Fullname",
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  fullname: string;

  @ApiProperty({
    enum: ["RUC", "DNI", "CE"],
    description: "Document type",
    example: "RUC",
  })
  @IsString({ message: "El tipo de documento es obligatorio" })
  @IsIn(["RUC", "DNI", "CE"], {
    message: "El tipo de documento debe ser RUC, DNI ó CE",
  })
  documentType: string;

  @ApiProperty({
    description: "Document number",
    example: "12345678",
    minimum: 8,
    maximum: 11,
  })
  @IsString({ message: "El número de documento es obligatorio" })
  @MinLength(8, {
    message: "El número de documento debe tener al menos 8 caracteres",
  })
  @MaxLength(11, {
    message: "El número de documento debe tener máximo 11 caracteres",
  })
  documentNumber: string;

  @ApiProperty({
    description: "Email",
    example: "email@test.com",
  })
  @IsString({ message: "El correo electrónico es obligatorio" })
  @IsEmail({}, { message: "El correo electrónico no es válido" })
  email: string;

  @ApiProperty({
    description: "Company",
    example: 1,
    default: null,
  })
  @IsNumber()
  @IsOptional()
  company: number;

  @ApiProperty({
    description: "Password",
    example: "Pa$$word123",
  })
  @IsString({ message: "La contraseña es obligatoria" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  @MaxLength(50, { message: "La contraseña debe tener máximo 50 caracteres" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,50}$/,
    {
      message:
        "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial",
    }
  )
  password: string;

  @ApiProperty({
    description: "Roles",
    example: ["admin", "super-user", "user"],
    default: ["user"],
  })
  @IsOptional()
  @IsString({
    each: true,
  })
  @IsArray()
  @IsIn([ValidRoles.admin, ValidRoles.superUser, ValidRoles.user])
  roles: string[];

  @ApiProperty({
    description: "Branches",
    example: [1, 2, 3],
    default: [],
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      each: true,
    }
  )
  @IsArray()
  branches: number[];
}
