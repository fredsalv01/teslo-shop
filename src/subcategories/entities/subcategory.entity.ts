import { Category } from "./../../categories/entities/category.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Branch } from "src/branches/entities/branch.entity";
import { Product } from "src/products/entities";

@Entity("subcategories")
export class Subcategory {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ type: "varchar", length: 50, nullable: false })
  name: string;
  @Column({ type: "varchar", length: 50, nullable: false })
  slug: string;
  @Column({ type: "boolean", default: true })
  isActive: boolean;
  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;
  @ManyToOne(() => Branch, (branch) => branch.subcategories, {
    onDelete: "CASCADE",
    nullable: false,
  })
  branch: Branch;
  @OneToMany(() => Product, (product) => product.subcategory, {
    cascade: true,
    eager: true,
  })
  products: Product[];

  createAt: Date;
  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
