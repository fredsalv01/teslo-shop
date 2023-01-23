import { ProductImage } from "../entities";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Brand } from "src/brands/entities/brand.entity";
import { Branch } from "src/branches/entities/branch.entity";
import { Category } from "src/categories/entities/category.entity";
import { Subcategory } from "src/subcategories/entities/subcategory.entity";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true })
  title: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @Column("float", { default: 0 })
  price: number;

  @Column("text", { unique: true })
  slug: string;

  @Column("text")
  sku: string;

  @Column("int", { default: 0 })
  available: number;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: "CASCADE",
  })
  brand: Brand;

  @ManyToOne(() => Branch, (branch) => branch.products, {
    onDelete: "CASCADE",
  })
  branch: Branch;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: "CASCADE",
  })
  category: Category;
  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, {
    onDelete: "CASCADE",
  })
  subcategory: Subcategory;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll(/[^a-z0-9_]/g, "");
  }

  @BeforeUpdate()
  checkUpdateSlug() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll(/[^a-z0-9_]/g, "");
  }
}
