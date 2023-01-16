import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities/category.entity';
import {} from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      this.handleDBExceptions(error);
    }
    return 'This action adds a new category';
  }

  findAll(paginationDto: PaginationDto) {
    const options = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
    };

    return this.paginate(options);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Category>> {
    const qb = this.categoryRepository.createQueryBuilder('category');
    qb.orderBy('category.id', 'DESC');
    return await paginate<Category>(qb, options);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }
}
