import { Subcategory } from "./../../subcategories/entities/subcategory.entity";
import { ManyToOne } from "typeorm";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Branch } from "src/branches/entities/branch.entity";
import { Product } from "src/products/entities";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text", { nullable: false })
  name: string;

  @Column("text", { unique: true, nullable: false })
  slug: string;

  @Column("boolean", { default: true })
  isActive: boolean;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
    cascade: true,
    eager: true,
  })
  subcategories: Subcategory[];

  @ManyToOne(() => Branch, (branch) => branch.categories, {
    onDelete: "CASCADE",
    nullable: true,
  })
  branch: Branch;

  @OneToMany(() => Product, (product) => product.category, {
    cascade: true,
    eager: true,
  })
  products: Product[];

  @Column("timestamptz", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @Column("timestamptz", {
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.name;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll(/[^a-z0-9_]/g, "");
  }

  @BeforeUpdate()
  checkUpdateSlug() {
    this.slug = this.name;
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll(/[^a-z0-9_]/g, "");
  }
}
