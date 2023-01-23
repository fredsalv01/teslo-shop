import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { DataSource, Repository } from "typeorm";
import { CreateSubcategoryDto, UpdateSubcategoryDto } from "./dto";
import { Subcategory } from "./entities/subcategory.entity";

@Injectable()
export class SubcategoriesService {
  private readonly logger = new Logger("SubcategoriesService");

  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    private readonly dataSource: DataSource
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const findSubcategory = await this.findOneSubcategoryByTerm(
      createSubcategoryDto.name
    );
    if (!findSubcategory)
      throw new NotFoundException(
        `Subcategory with term ${createSubcategoryDto.name} not found`
      );
    try {
      const subcategory =
        this.subcategoryRepository.create(createSubcategoryDto);
      await this.subcategoryRepository.save(subcategory);

      return subcategory;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const options = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
    };
    return paginate(this.subcategoryRepository, options);
  }

  findOne(id: number) {
    const subcategory = this.subcategoryRepository.findOne({
      where: { id, isActive: true },
    });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with id ${id} not found`);
    }
    return subcategory;
  }

  async findOneSubcategoryByTerm(term: string) {
    const subcategory =
      this.subcategoryRepository.createQueryBuilder("subcategory");
    subcategory.where("subcategory.name like :name", { name: `%${term}%` });
    subcategory.andWhere("subcategory.isActive = :isActive", {
      isActive: true,
    });
    subcategory.getOne();

    if (!subcategory) {
      throw new NotFoundException(`Brand with term ${term} not found`);
    }
    return subcategory;
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    const subcategory = await this.subcategoryRepository.preload({
      id: id,
      ...updateSubcategoryDto,
    });
    if (!subcategory) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(subcategory);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return subcategory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const subcategory = this.findOne(id);
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with id ${id} not found`);
    }
    await this.subcategoryRepository.update(id, { isActive: false });
    return { message: `Subcategory with id ${id} deleted` };
  }

  async paginate(options: any) {
    const queryBuilder =
      this.subcategoryRepository.createQueryBuilder("subcategory");
    queryBuilder.where("subcategory.isActive = :isActive", {
      isActive: true,
    });
    const result = await paginate<Subcategory>(queryBuilder, options);
    return result;
  }

  async handleDBExceptions(error: any) {
    this.logger.error(error);
    if (error.code === "23505") {
      throw new NotFoundException(
        `Subcategory with name ${error.detail} already exists`
      );
    }
  }
}
