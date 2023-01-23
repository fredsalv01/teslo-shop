import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { DataSource, Repository } from "typeorm";
import { CreateBranchDto, UpdateBranchDto } from "./dto";
import { Branch } from "./entities/branch.entity";

@Injectable()
export class BranchesService {
  logger = new Logger("BranchesService");
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly dataSource: DataSource
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    try {
      const findBranch = await this.findOneBranchesByTerm(createBranchDto.name);
      if (findBranch) {
        throw new BadRequestException(
          `Branch with name ${createBranchDto.name} already exists`
        );
      }
      const branch = this.branchRepository.create(createBranchDto);
      await this.branchRepository.save(branch);
      return branch;
    } catch (error) {
      this.handleDBExceptions(error);
    }
    return "This action adds a new branch";
  }

  async findAll(paginationDto: PaginationDto) {
    const options = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
    };
    return await this.paginate(options);
  }

  findOne(id: number) {
    const branch = this.branchRepository.findOne({
      where: { id, isActive: true },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with id ${id} not found`);
    }
    return branch;
  }

  findOneBranchesByTerm(term: string) {
    const branch = this.branchRepository.createQueryBuilder("branch");
    branch.where("branch.name like :name", { name: `%${term}%` });
    branch.andWhere("branch.isActive = :isActive", { isActive: true });
    branch.getOne();

    if (!branch) {
      throw new NotFoundException(`Brand with term ${term} not found`);
    }
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchRepository.preload({
      id: id,
      ...updateBranchDto,
    });
    if (!branch) {
      throw new NotFoundException(`Branch with id ${id} not found`);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(branch);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return branch;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const branch = await this.branchRepository.findOne({
      where: { id, isActive: true },
    });
    if (!branch) {
      throw new BadRequestException(`branch with id ${id} not found`);
    }
    this.branchRepository.update(id, { isActive: false });
    await this.branchRepository.save(branch);
    return { message: `Branch with ${id} has been inactivated` };
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Branch>> {
    const qb = this.branchRepository
      .createQueryBuilder("q")
      .andWhere("q.isActive = :isActive", { isActive: true })
      .orderBy("q.id", "DESC");
    return await paginate<Branch>(qb, options);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }
}
