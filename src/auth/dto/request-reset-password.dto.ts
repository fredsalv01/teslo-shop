import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestResetPasswordDto {
  @ApiProperty({
    description: "Email",
    example: "fredalbertm37@gmail.com",
  })
  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}
