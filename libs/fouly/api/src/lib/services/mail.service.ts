import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailCommand } from '@skare/fouly/data';
import axios from 'axios';
@Injectable()
export class MailService {
  private apiKeyEnv = 'FOULY-SENDGRID-API-KEY';
  private mailFoulyAdmin = 'FOULY-EMAIL-ADMIN';
  private sendGridUrl = 'FOULY-SENDGRID-URL';
  private readonly logger = new Logger(MailService.name);
  constructor(private configService: ConfigService) {}

  async sendMail(cmd: MailCommand): Promise<void> {
    this.logger.debug(`About to send email ${JSON.stringify(cmd)}`);
    const sendGridKey = this.configService.get<string>(this.apiKeyEnv);
    const emailToAdmin = this.configService.get<string>(this.mailFoulyAdmin);
    const sendGridUrl = this.configService.get<string>(this.sendGridUrl);
    axios.defaults.headers.post['Authorization'] = 'Bearer ' + sendGridKey;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    const message = {
      personalizations: [{ to: [{ email: emailToAdmin }] }],
      from: { email: cmd.fromEmail },
      subject: cmd.subject,
      content: [
        {
          type: 'text/plain',
          value: cmd.message
        }
      ]
    };

    try {
      await axios.post(sendGridUrl, message);
      return;
    } catch (err) {
      this.logger.error('There was an error calling axios.post', err);
      throw new BadRequestException();
    }
  }
}
