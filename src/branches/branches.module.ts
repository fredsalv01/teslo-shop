import { Module } from "@nestjs/common";
import { BranchesService } from "./branches.service";
import { BranchesController } from "./branches.controller";
import { Branch } from "./entities/branch.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [BranchesController],
  providers: [BranchesService],
  imports: [TypeOrmModule.forFeature([Branch]), AuthModule],
})
export class BranchesModule {}
