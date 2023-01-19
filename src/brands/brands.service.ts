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

  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = this.brandRepository.create(createBrandDto);
      await this.brandRepository.save(brand);
      return brand;
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
    const brand = await this.brandRepository.findOne({
      where: { id, isActive: true },
    });
    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id: id,
      ...updateBrandDto,
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

  remove(id: number) {
    this.findOne(id);
    this.brandRepository.update({ id }, { isActive: false });
    return { message: `The brand with id ${id} has been deleted` };
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Brand>> {
    const qb = this.brandRepository.createQueryBuilder("q");
    qb.orderBy("q.id", "DESC");
    return await paginate<Brand>(qb, options);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }
}
