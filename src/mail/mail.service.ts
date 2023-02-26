import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordToken(user: User, token: string) {
    const url = `https://laundy-app.onrender.com/api/auth/reset-password/${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: "WashyWashy - Reset Password",
      template: "reset-password",
      context: {
        name: user.fullname,
        url,
      },
    });
  }

  async sendConfirmEmail(user: User) {
    const url = `https://laundy-app.onrender.com/api/auth/confirm-account/${user.userActiveToken}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: "WashyWashy - Welcome",
      template: "confirm-account",
      context: {
        name: user.fullname,
        url,
      },
    });
  }
}
