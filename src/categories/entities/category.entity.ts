import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
 
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 255, unique: true })
  name: string;

  @Column('varchar', { length: 255 })
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('tinyint', { default: 1 }) // 1: active, 0: inactive
  status: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

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
  generateSlugOnUpdate() {
    this.generateSlug();
  }

}
