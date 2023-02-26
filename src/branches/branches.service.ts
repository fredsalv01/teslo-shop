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
import { User } from "src/auth/entities/user.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { DataSource, Repository } from "typeorm";
import { CreateBranchDto, UpdateBranchDto } from "./dto";
import { Branch } from "./entities/branch.entity";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class BranchesService {
  logger = new Logger("BranchesService");
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly dataSource: DataSource,
    private readonly authService: AuthService
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const { company, ...restData } = createBranchDto;
    const findBranch = await this.findOneBranchesByTerm(createBranchDto.name);
    if (findBranch) {
      throw new BadRequestException(
        `Branch with name ${createBranchDto.name} already exists`
      );
    }
    try {
      const branch = this.branchRepository.create({
        ...restData,
        company: { id: company },
      });
      await this.branchRepository.save(branch);
      return branch;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const userData = await this.authService.getUserData(user.id);
    const options = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
    };
    if (userData.companyId !== null) {
      return await this.paginate(options, userData.companyId);
    }
    return await this.paginate(options, null);
  }

  async findOne(id: number, user: User) {
    const userData = await this.authService.getUserData(user.id);
    if (userData.companyId !== null) {
      return this.findOneBranchesByCompany(id, userData.companyId);
    }
    const branch = this.branchRepository.findOne({
      where: { id, isActive: true },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with id ${id} not found`);
    }
    return branch;
  }

  async findOneBranchesByCompany(id: number, companyId: number) {
    const branch = await this.branchRepository.findOne({
      where: { id, isActive: true, company: { id: companyId } },
    });
    if (!branch) {
      throw new NotFoundException(`Branch with id ${id} not found`);
    }
    return branch;
  }

  async findOneBranchesByTerm(term: string) {
    const branch = await this.branchRepository
      .createQueryBuilder("branches")
      .where("branches.name like :name", { name: `%${term}%` })
      .andWhere("branches.isActive = :isActive", { isActive: true })
      .getOne();
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { company, ...restData } = updateBranchDto;
    const findBranch = await this.findOneBranchesByTerm(updateBranchDto.name);
    if (findBranch && findBranch.id !== id) {
      throw new BadRequestException(
        `Branch with name ${updateBranchDto.name} already exists`
      );
    }
    const branch = await this.branchRepository.preload({
      id: id,
      ...restData,
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

  async paginate(
    options: IPaginationOptions,
    companyId: number | null
  ): Promise<Pagination<Branch>> {
    const qb = this.branchRepository.createQueryBuilder("q");
    if (companyId !== null) {
      qb.where("q.companyId = :companyId", { companyId: companyId });
    }
    qb.andWhere("q.isActive = :isActive", { isActive: true });
    qb.orderBy("q.id", "DESC");
    return await paginate<Branch>(qb, options);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }
}
