import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SubcategoriesService } from "./subcategories.service";
import { CreateSubcategoryDto, UpdateSubcategoryDto } from "./dto";
import { PaginationDto } from "../common/dtos/pagination.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("subcategories")
@Controller("subcategories")
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  findAll(@Param() paginationDto: PaginationDto) {
    return this.subcategoriesService.findAll(paginationDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subcategoriesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto
  ) {
    return this.subcategoriesService.update(+id, updateSubcategoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.subcategoriesService.remove(+id);
  }
}
