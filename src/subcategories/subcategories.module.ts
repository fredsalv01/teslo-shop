import { Module } from "@nestjs/common";
import { SubcategoriesService } from "./subcategories.service";
import { SubcategoriesController } from "./subcategories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subcategory } from "./entities/subcategory.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
  imports: [TypeOrmModule.forFeature([Subcategory]), AuthModule],
  exports: [SubcategoriesService, TypeOrmModule],
})
export class SubcategoriesModule {}
