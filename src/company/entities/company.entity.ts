import { Branch } from "src/branches/entities/branch.entity";
import { User } from "src/auth/entities/user.entity";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("companies")
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 11,
    unique: true,
  })
  socialReason: string;

  @Column({
    type: "varchar",
    length: 55,
    unique: true,
  })
  comercialName: string;

  @Column({
    type: "boolean",
    default: true,
  })
  status: boolean;

  @Column({
    type: "varchar",
    length: 55,
  })
  slug: string;

  @Column({
    type: "integer",
  })
  maxUsers: number;

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

  @OneToMany(() => User, (user) => user.company, {
    cascade: true,
    eager: true,
  })
  users?: User[];

  @OneToMany(() => Branch, (branch) => branch.company, {
    cascade: true,
    eager: true,
  })
  branches?: Branch[];

  @BeforeInsert()
  updateSlugBeforeInsert() {
    if (!this.slug) {
      this.slug = this.comercialName;
    }
    this.slug = this.slug
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  @BeforeUpdate()
  updateSlug() {
    if (!this.slug) {
      this.slug = this.comercialName;
    }

    this.slug = this.slug
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
}
