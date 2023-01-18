import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordToken(user: User, token: string) {
    const url = `http://localhost:3000/auth/reset-password/${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'WashyWashy - Reset Password',
      template: 'reset-password',
      context: {
        name: user.fullname,
        url,
      },
    });
  }
}