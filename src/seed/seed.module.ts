import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { SeedController } from "./seed.controller";
import { ProductsModule } from "src/products/products.module";
import { AuthModule } from "../auth/auth.module";
import { CompanyModule } from "src/company/company.module";

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, AuthModule, CompanyModule],
})
export class SeedModule {}
