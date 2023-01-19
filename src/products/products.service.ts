import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate } from 'uuid';
import { ProductImage, Product } from './entities';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate/dist/paginate';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = Array<ProductImage>(), ...productDetails } =
        createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({
            url: image,
          }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const options = {
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
    };

    const pagination = await this.paginate(options);
    return pagination;
  }

  async findOne(term: string) {
    let product: Product;

    if (validate(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Product with term ${term} not found`);
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    // query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, {
          product: { id: product.id },
        });
        product.images = images.map((image) =>
          this.productImageRepository.create({
            url: image,
          }),
        );
      } else {
        product.images = await this.productImageRepository.findBy({
          product: { id },
        });
      }
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.detail);
  }

  // seeder
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    return await paginate(this.productRepository, options);
  }
}
