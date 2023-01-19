import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsUUID,
} from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({ message: "El token es obligatorio" })
  @IsUUID("4", { message: "El token es incorrecto" })
  resetPasswordToken: string;

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
