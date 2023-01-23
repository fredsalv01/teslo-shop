import { Brand } from "src/brands/entities/brand.entity";
import { Category } from "src/categories/entities/category.entity";
import { Company } from "src/company/entities/company.entity";
import { Product } from "src/products/entities";
import { Subcategory } from "src/subcategories/entities/subcategory.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";

@Entity("branches")
export class Branch {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "text",
    nullable: false,
  })
  name: string;

  @Column({
    type: "text",
    nullable: false,
  })
  slug: string;

  @ManyToOne(() => Company, (company) => company.branches, {
    onDelete: "CASCADE",
    nullable: false,
  })
  company: Company;

  @OneToMany(() => Category, (category) => category.branch, {
    cascade: true,
    eager: true,
  })
  categories: Category[];

  @OneToMany(() => Subcategory, (subcategory) => subcategory.branch, {
    cascade: true,
    eager: true,
  })
  subcategories: Subcategory[];

  @OneToMany(() => Brand, (brand) => brand.branch, {
    cascade: true,
    eager: true,
  })
  brands: Brand[];

  @OneToMany(() => Product, (product) => product.branch, {
    cascade: true,
    eager: true,
  })
  products: Product[];

  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive: boolean;

  @BeforeInsert()
  slugify() {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  @BeforeUpdate()
  updateFields() {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    this.updatedAt = new Date();
  }
}
