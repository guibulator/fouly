import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailCommand } from '@skare/fouly/data';
import axios from 'axios';
@Injectable()
export class MailService {
  private apiKeyEnv = 'FOULY-SENDGRID-API-KEY';
  private mailFoulyAdmin = 'FOULY-EMAIL-ADMIN';
  private sendGridUrl = 'FOULY-SENDGRID-URL';
  constructor(private configService: ConfigService, private logger: Logger) {
    this.logger.setContext(MailService.name);
  }

  async sendMail(cmd: MailCommand): Promise<boolean> {
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
      this.logger.debug('Before calling axios.post');
      await axios.post(sendGridUrl, message);
      this.logger.debug('after calling axios.post');
      return true;
    } catch (err) {
      this.logger.error('There was an error calling axios.post', err);
      throw new BadRequestException();
    }
  }
}
