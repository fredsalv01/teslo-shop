import { ProductImage } from "../entities";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";

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
