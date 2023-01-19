import { IsNotEmpty, IsString } from "class-validator";
export class CreateBrandDto {
  @IsString()
  @IsNotEmpty({ message: "El nombre de la marca es obligatorio" })
  name: string;
}
