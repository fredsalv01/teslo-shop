import { PaginationDto } from './../common/dtos/pagination.dto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { Company } from './entities/company.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger('CompaniesService');

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = this.companyRepository.create(createCompanyDto);
      await this.companyRepository.save(createCompanyDto);
      return company;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const options = {
      page: page,
      limit: limit,
    };
    return await this.paginate(options);
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id, status: true },
    });
    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.preload({
      id: id,
      ...updateCompanyDto,
    });
    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(company);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return company;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  remove(id: number) {
    const company = this.companyRepository.findOne({
      where: { id, status: true },
    });
    if (!company) {
      throw new BadRequestException(`Company with id ${id} not found`);
    }
    this.companyRepository.update(id, { status: false });
    return { message: `Company with ${id} has been inactivated` };
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Company>> {
    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .andWhere('company.status = :status', { status: true })
      .orderBy('company.id', 'DESC');

    return await paginate<Company>(queryBuilder, options);
  }
}
