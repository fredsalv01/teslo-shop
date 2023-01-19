import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  fullname: string;

  @IsString({ message: "El tipo de documento es obligatorio" })
  @IsIn(["RUC", "DNI", "CE"], {
    message: "El tipo de documento debe ser RUC, DNI ó CE",
  })
  documentType: string;

  @IsString({ message: "El número de documento es obligatorio" })
  @MinLength(8, {
    message: "El número de documento debe tener al menos 8 caracteres",
  })
  @MaxLength(11, {
    message: "El número de documento debe tener máximo 11 caracteres",
  })
  documentNumber: string;

  @IsString({ message: "El correo electrónico es obligatorio" })
  @IsEmail({}, { message: "El correo electrónico no es válido" })
  email: string;

  @IsNumber()
  @IsOptional()
  company: number;

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
}
