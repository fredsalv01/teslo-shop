import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({
    description: "Email",
    example: "admin@admin.com",
  })
  @IsString({ message: "El correo electrónico es obligatorio" })
  @IsEmail({}, { message: "El correo electrónico no es válido" })
  email: string;

  @ApiProperty({
    description: "Password",
    example: "Admin1$trator",
  })
  @IsString({ message: "La contraseña es obligatoria" })
  password: string;
}
