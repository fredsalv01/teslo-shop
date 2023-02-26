import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger/dist";
import { Auth, GetUser } from "src/auth/decorators";
import { User } from "src/auth/entities/user.entity";
import { ValidRoles } from "src/auth/interfaces";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { BrandsService } from "./brands.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";

@ApiTags("brands")
@Controller("brands")
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  create(@Body() createBrandDto: CreateBrandDto, @GetUser() user: User) {
    return this.brandsService.create(createBrandDto, user);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  findAll(@Param() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.brandsService.findAll(paginationDto, user);
  }

  @Get(":id")
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user)
  findOne(@Param("id") id: string, @GetUser() user: User) {
    return this.brandsService.findOne(+id, user);
  }

  @Patch(":id")
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  update(@Param("id") id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.brandsService.remove(+id);
  }
}
