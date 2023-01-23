import { Company } from "src/company/entities/company.entity";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text", { nullable: true })
  fullname: string;

  @Column("text", { nullable: false })
  documentType: string;

  @Column("text", { unique: true, nullable: false })
  documentNumber: string;

  @Column("text", { unique: true, nullable: false })
  email: string;

  @Column("text", { nullable: false, select: false })
  password: string;

  @Column("bool", { default: true })
  isActive: boolean;

  @Column("text", { array: true, default: ["user"] })
  roles: string[];

  @ManyToOne(() => Company, (company) => company.users, {
    onDelete: "CASCADE",
    nullable: true,
  })
  company?: Company;

  @Column("uuid", { unique: true, name: "userActiveToken", nullable: true })
  userActiveToken: string;

  @Column("uuid", { unique: true, name: "resetPasswordToken", nullable: true })
  resetPasswordToken: string;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
