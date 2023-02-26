import { Branch } from "src/branches/entities/branch.entity";
import { Product } from "src/products/entities";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("brands")
export class Brand {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "text",
    nullable: false,
  })
  name: string;

  @Column({
    type: "text",
  })
  slug: string;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => Branch, (branch) => branch.brands, {
    onDelete: "CASCADE",
    nullable: true,
  })
  branch: Branch;

  @OneToMany(() => Product, (product) => product.brand, {
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

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll(/[^a-z0-9_]/g, "");
    }
  }

  @BeforeUpdate()
  updateData() {
    this.generateSlug;
    this.updatedAt = new Date();
  }
}
