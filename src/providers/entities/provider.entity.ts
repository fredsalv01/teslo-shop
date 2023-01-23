import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("providers")
export class Provider {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "text",
    nullable: false,
  })
  name: string;

  @Column({
    type: "text",
    nullable: true,
  })
  phone: string;

  @Column({
    type: "text",
    nullable: false,
  })
  documentType: string;

  @Column({
    type: "text",
    nullable: false,
  })
  documentNumber: string;

  @Column({
    type: "text",
  })
  address: string;

  @Column({
    type: "text",
    nullable: true,
  })
  email: string;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive: boolean;

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
}
