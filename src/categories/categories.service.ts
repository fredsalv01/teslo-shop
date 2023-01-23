import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
import { Category } from "./entities/category.entity";
import {} from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger("CategoriesService");
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const options = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
    };

    return await this.paginate(options);
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id: id,
      ...updateCategoryDto,
    });

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(category);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return category;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  remove(id: number) {
    const category = this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    this.categoryRepository.update({ id }, { isActive: false });
    return { message: `The category with id ${id} has been deleted` };
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Category>> {
    const qb = this.categoryRepository
      .createQueryBuilder("q")
      .andWhere("q.is_active = true");
    qb.orderBy("q.id", "DESC");
    return await paginate<Category>(qb, options);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }
}
