import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateProviderDto, UpdateProviderDto } from "./dto";
import { Provider } from "./entities/provider.entity";
import { PaginationDto } from "../common/dtos/pagination.dto";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";

@Injectable()
export class ProvidersService {
  logger = new Logger("ProvidersService");

  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly dataSource: DataSource
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    try {
      const exists = await this.findOneProviderByTerm(
        createProviderDto.documentNumber
      );
      if (exists) {
        throw new BadRequestException(
          `Provider with document number ${createProviderDto.documentNumber} already exists`
        );
      }
      const provider = this.providerRepository.create(createProviderDto);
      await this.providerRepository.save(provider);
      return provider;
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

  findOne(id: number) {
    const provider = this.providerRepository.findOne({
      where: { id, isActive: true },
    });
    if (!provider) {
      throw new NotFoundException(`Provider with id ${id} not found`);
    }
    return provider;
  }

  async findOneProviderByTerm(term: string) {
    const provider = await this.providerRepository
      .createQueryBuilder("provider")
      .where("provider.documentNumber like :documentNumber", {
        documentNumber: `%${term}%`,
      })
      .orWhere("provider.email like :email", { email: `%${term}%` })
      .orWhere("provider.name like :name", { name: `%${term}%` })
      .andWhere("provider.isActive = :isActive", { isActive: true })
      .getOne();
    return provider;
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    const provider = await this.providerRepository.preload({
      id: id,
      ...updateProviderDto,
    });
    if (!provider) {
      throw new NotFoundException(`Provider with id ${id} not found`);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(provider);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return provider;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const provider = await this.findOne(id);
    if (!provider) {
      throw new NotFoundException(`Provider with id ${id} not found`);
    }
    provider.isActive = false;
    await this.providerRepository.save(provider);
    return provider;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Provider>> {
    const qb = this.providerRepository
      .createQueryBuilder("q")
      .andWhere("q.isActive = :isActive", { isActive: true })
      .orderBy("q.id", "DESC");
    return await paginate<Provider>(qb, options);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }
}
