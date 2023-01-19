import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
  @IsString({ message: "El correo electrónico es obligatorio" })
  @IsEmail({}, { message: "El correo electrónico no es válido" })
  email: string;

  @IsString({ message: "La contraseña es obligatoria" })
  password: string;
}
