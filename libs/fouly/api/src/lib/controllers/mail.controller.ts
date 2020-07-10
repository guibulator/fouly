import { Body, Controller, Post } from '@nestjs/common';
import { MailCommand, RegisterBusinessMailCommand } from '@skare/fouly/data';
import { MailService } from '../services/mail.service';
@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('contactForm')
  async sendMail(@Body() mail: MailCommand) {
    return await this.mailService.sendMailForContactForm(mail);
  }

  @Post('registerBusinessForm')
  async registerBusinessForm(@Body() mail: RegisterBusinessMailCommand) {
    return await this.mailService.sendMailForRegisterBusinessForm(mail);
  }
}
