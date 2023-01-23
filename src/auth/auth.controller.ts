import { Controller, Get, Post, Body, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger/dist";
import { AuthService } from "./auth.service";
import { Auth } from "./decorators";
import { GetUser } from "./decorators/get-user.decorator";
import {
  LoginUserDto,
  CreateUserDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
} from "./dto";
import { User } from "./entities/user.entity";
import { ValidRoles } from "./interfaces";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  // @Auth(ValidRoles.superUser, ValidRoles.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("private")
  @ApiBearerAuth()
  @Auth(ValidRoles.user, ValidRoles.superUser, ValidRoles.admin)
  GetAuthUserInfo(@GetUser() user: User) {
    return {
      user,
    };
  }

  @ApiBearerAuth()
  @Auth(ValidRoles.user, ValidRoles.superUser, ValidRoles.admin)
  @Post("refresh")
  refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Patch("request-reset-password")
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto
  ) {
    return this.authService.requestResetPassword(requestResetPasswordDto);
  }

  @Patch("reset-password")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Patch("confirm-account")
  confirmAccount(@Body("token") token: string) {
    return this.authService.confirmAccount(token);
  }
}
