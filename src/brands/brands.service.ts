import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { User } from "src/auth/entities/user.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { DataSource, Repository } from "typeorm";
import { CreateBrandDto, UpdateBrandDto } from "./dto";
import { Brand } from "./entities/brand.entity";

@Injectable()
export class BrandsService {
  logger = new Logger("BrandsService");
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly dataSource: DataSource
  ) {}

  async create(createBrandDto: CreateBrandDto, user: User) {
    const findBrand = await this.findOneBranchesByTerm(createBrandDto.name);
    if (findBrand) {
      throw new BadRequestException(
        `Brand with name ${createBrandDto.name} already exists`
      );
    }
    try {
      createBrandDto.branch =
        user.branches.length > 0 ? user.branches[0] : null;

      const { name, branch } = createBrandDto;
      const brand = this.brandRepository.create({
        name,
        branch: branch ? { id: branch } : null,
      });
      await this.brandRepository.save(brand);
      return brand;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { branches } = user;
    const options = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
    };
    return await this.paginate(options, branches);
  }

  async findOneBranchesByTerm(term: string) {
    const branch = await this.brandRepository
      .createQueryBuilder("brands")
      .where("brands.name like :name", { name: `%${term}%` })
      .andWhere("brands.isActive = :isActive", { isActive: true })
      .getOne();
    return branch;
  }

  async findOne(id: number, user: User) {
    const { branches } = user;
    const brand = await this.brandRepository.findOne({
      where: { id, isActive: true },
      relations: ["branch"],
    });
    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    if (branches.length > 0 && !branches.includes(brand.branch.id)) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const findBrand = await this.findOneBranchesByTerm(updateBrandDto.name);
    if (findBrand && findBrand.id !== id) {
      throw new BadRequestException(
        `Brand with name ${updateBrandDto.name} already exists`
      );
    }
    const { branch, ...restUpdate } = updateBrandDto;
    const brand = await this.brandRepository.preload({
      id: id,
      ...restUpdate,
      branch: branch ? { id: branch } : null,
    });

    if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(brand);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return brand;
    } catch (error) {
      this.handleDBExceptions(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const brand = await this.brandRepository.findOne({
      where: { id, isActive: true },
    });
    if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);
    this.brandRepository.update({ id }, { isActive: false });
    return { message: `The brand with id ${id} has been deleted` };
  }

  async paginate(
    options: IPaginationOptions,
    branches: number[]
  ): Promise<Pagination<Brand>> {
    const qb = this.brandRepository.createQueryBuilder("q");
    if (branches.length > 0) {
      qb.where("q.branchId IN (:...branches)", { branches });
    }
    qb.orderBy("q.id", "DESC");
    return await paginate<Brand>(qb, options);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }
}
