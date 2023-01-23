import { Category } from "./../../categories/entities/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  createAt: Date;
  @Column({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
