import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmail } from './dto/send-email.dto';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendMail({ to, subject, template, context }: SendEmail) {
    await this.mailService.sendMail({
      to,
      subject,
      template: `./${template}`,
      context,
    });
  }
}
