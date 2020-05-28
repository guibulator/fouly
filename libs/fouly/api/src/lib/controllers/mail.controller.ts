import { Body, Controller, Post } from '@nestjs/common';
import { MailCommand } from '@skare/fouly/data';
import { MailService } from '../services/mail.service';
@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post()
  async sendMail(@Body() mail: MailCommand) {
    return this.mailService.sendMail(mail);
  }
}
