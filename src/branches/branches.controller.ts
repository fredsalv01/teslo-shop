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
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { BranchesService } from "./branches.service";
import { CreateBranchDto, UpdateBranchDto } from "./dto";

@ApiTags("branches")
@Controller("branches")
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  findAll(@Param() paginationDto: PaginationDto) {
    return this.branchesService.findAll(paginationDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.branchesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(+id, updateBranchDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.branchesService.remove(+id);
  }
}
