import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ProvidersService } from "./providers.service";
import { CreateProviderDto, UpdateProviderDto } from "./dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { ApiTags } from "@nestjs/swagger/dist";

@ApiTags("providers")
@Controller("providers")
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  findAll(@Param() paginationDto: PaginationDto) {
    return this.providersService.findAll(paginationDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.providersService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateProviderDto: UpdateProviderDto
  ) {
    return this.providersService.update(+id, updateProviderDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.providersService.remove(+id);
  }
}
