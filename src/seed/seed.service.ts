import { AuthService } from "./../auth/auth.service";
import { Injectable } from "@nestjs/common";
import { ProductsService } from "src/products/products.service";
import { initialData } from "./data/seed-data";
import { CompanyService } from "../company/company.service";

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    private readonly authService: AuthService,
    private readonly companyService: CompanyService
  ) {}
  async executeSeed() {
    await this.insertNewProducts();
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts();
    await this.authService.deleteAllUsers();
    await this.companyService.deleteAllCompanies();

    const products = initialData.products;
    const users = initialData.users;
    const companies = initialData.companies;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product));
    });
    companies.forEach((company) => {
      insertPromises.push(this.companyService.create(company));
    });
    users.forEach((user) => {
      insertPromises.push(this.authService.create(user));
    });
    await Promise.all(insertPromises);
    return { message: "seed executed" };
  }
}
