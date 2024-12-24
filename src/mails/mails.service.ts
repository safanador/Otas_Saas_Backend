import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(name: string, email: string, resetUrl) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Acount Successfully Created',
      template: './welcome',
      context: {
        name: name,
        url: resetUrl,
      },
    });
  }

  async sendResetToken(name: string, email: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password here',
      template: './welcome',
      context: {
        name: name,
        url: url,
      },
    });
  }
}
