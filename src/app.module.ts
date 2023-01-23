import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "./products/products.module";
import { CommonModule } from "./common/common.module";
import { SeedModule } from "./seed/seed.module";
import { FilesModule } from "./files/files.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { CompanyModule } from "./company/company.module";
import { MailModule } from "./mail/mail.module";
import { BrandsModule } from "./brands/brands.module";
import { BranchesModule } from "./branches/branches.module";
import { SubcategoriesModule } from "./subcategories/subcategories.module";
import { ProvidersModule } from "./providers/providers.module";

@Module({
  imports: [
    // Import the module as shown below
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "static"),
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    CategoriesModule,
    CompanyModule,
    MailModule,
    BrandsModule,
    BranchesModule,
    SubcategoriesModule,
    ProvidersModule,
  ],
})
export class AppModule {}
