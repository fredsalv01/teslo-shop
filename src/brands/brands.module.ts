import { Module } from "@nestjs/common";
import { BrandsService } from "./brands.service";
import { BrandsController } from "./brands.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "./entities/brand.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [TypeOrmModule.forFeature([Brand]), AuthModule],
  exports: [TypeOrmModule, BrandsService],
})
export class BrandsModule {}
