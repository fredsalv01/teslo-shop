import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger/dist";
import { Auth, GetUser } from "src/auth/decorators";
import { User } from "src/auth/entities/user.entity";
import { ValidRoles } from "src/auth/interfaces";
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
  @ApiBearerAuth()
  @Auth(ValidRoles.user, ValidRoles.superUser, ValidRoles.admin)
  findAll(@GetUser() user: User, @Param() paginationDto: PaginationDto) {
    return this.branchesService.findAll(paginationDto, user);
  }

  @Get(":id")
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  findOne(@Param("id") id: string, @GetUser() user: User) {
    return this.branchesService.findOne(+id, user);
  }

  @Patch(":id")
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  update(@Param("id") id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(+id, updateBranchDto);
  }

  @Delete(":id")
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  remove(@Param("id") id: string) {
    return this.branchesService.remove(+id);
  }
}
