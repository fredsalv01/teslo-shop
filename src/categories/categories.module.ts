import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Category]),
    AuthModule,
  ],
  exports: [TypeOrmModule],
})
export class CategoriesModule {}
