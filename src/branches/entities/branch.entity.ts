import { Company } from "src/company/entities/company.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
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

  @ManyToOne(() => Company, (company) => company.branches)
  company: Company;

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
