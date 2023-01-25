import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import {
  LoginUserDto,
  CreateUserDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
} from "./dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuid } from "uuid";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, company, ...userData } = createUserDto;
      const userActiveToken = uuid();
      const user = this.userRepository.create({
        ...userData,
        company: company ? { id: company } : null,
        password: bcrypt.hashSync(password, 10),
        userActiveToken,
        isActive: false,
      });
      await this.userRepository.save(user);

      await this.mailService.sendConfirmEmail(user);
      return user;
    } catch (error) {
      Logger.error(error);
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email, isActive: true },
        select: ["id", "email", "password", "roles"],
      });
      if (!user) {
        throw new UnauthorizedException(
          "El email es incorrecto o no esta activo"
        );
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException("La contraseña es incorrecta");
      }
      delete user.password;
      return {
        token: this.getJwtToken({
          email: user.email,
          roles: user.roles,
          id: user.id,
        }),
      };
    } catch (error) {
      Logger.error(error);
      this.handleDBErrors(error);
    }
  }

  async getUserData(id: number) {
    const data = await this.userRepository.findOne({
      where: { id },
      join: {
        alias: "user",
        leftJoinAndSelect: {
          company: "user.company",
        },
      },
    });
    return {
      id: data.id,
      email: data.email,
      fullname: data.fullname,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      roles: data.roles,
      branches: data.branches,
      companyId: data.company !== null ? data.company.id : null,
      companyName: data.company !== null ? data.company.comercialName : null,
      companyRuc: data.company !== null ? data.company.socialReason : null,
    };
  }

  refresh(refreshToken: string) {
    try {
      const user = this.jwtService.decode(refreshToken) as JwtPayload;
      return {
        token: this.getJwtToken({
          email: user.email,
          roles: user.roles,
          id: user.id,
        }),
      };
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException("El token no es válido");
    }
  }

  async confirmAccount(token: string) {
    const user = await this.userRepository.findOne({
      where: { userActiveToken: token },
    });
    if (!user) {
      throw new NotFoundException("El token no es válido");
    }
    user.isActive = true;
    user.userActiveToken = null;
    await this.userRepository.save(user);
    return { message: "Cuenta activada correctamente" };
  }

  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto) {
    const { email } = requestResetPasswordDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new UnprocessableEntityException("Esta acción no es válida");
    }
    user.resetPasswordToken = uuid();
    await this.userRepository.save(user);

    await this.mailService.sendResetPasswordToken(
      user,
      user.resetPasswordToken
    );
    // TODO: Send email using email service
    return { message: "Se ha enviado un email a tu cuenta" };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetPasswordToken, password } = resetPasswordDto;
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken },
    });
    if (!user) {
      throw new NotFoundException("El token no es válido");
    }
    user.password = bcrypt.hashSync(password, 10);
    user.resetPasswordToken = null;
    await this.userRepository.save(user);

    return { message: "Contraseña actualizada correctamente" };
  }

  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder("user");
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(
        "El email o el documento ya se encuentra registrado"
      );
    }
    throw new InternalServerErrorException(error);
  }
}
