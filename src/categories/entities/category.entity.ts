import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { nullable: false })
  name: string;

  @Column('text', { unique: true, nullable: false })
  slug: string;

  @Column('timestamptz', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column('timestamptz', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug) {
      this.slug = this.name;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(/[^a-z0-9_]/g, '');
  }

  @BeforeUpdate()
  checkUpdateSlug() {
    this.generateSlug();
  }
}
