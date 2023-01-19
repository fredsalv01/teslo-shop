import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
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
