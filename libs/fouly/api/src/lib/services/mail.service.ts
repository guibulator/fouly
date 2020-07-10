/**
 * https://sendgrid.com/docs/API_Reference/api_v3.html
 */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailCommand, RegisterBusinessMailCommand } from '@skare/fouly/data';
import axios from 'axios';
@Injectable()
export class MailService {
  private readonly sendGridKey: string;
  private readonly emailFeedback: string;
  private readonly emailRegisterBusiness: string;
  private readonly sendGridUrl: string;
  private readonly feedbackTemplateId: string;
  constructor(private configService: ConfigService, private logger: Logger) {
    this.logger.setContext(MailService.name);
    this.sendGridKey = this.configService.get<string>('FOULY-SENDGRID-API-KEY');
    this.emailFeedback = this.configService.get<string>('FOULY-EMAIL-FEEDBACK');
    this.emailRegisterBusiness = this.configService.get<string>('FOULY-EMAIL-FEEDBACK'); //TODO: get a different mail for us?
    this.sendGridUrl = this.configService.get<string>('FOULY-SENDGRID-URL');
    this.feedbackTemplateId = this.configService.get<string>('FOULY-SENDGRID-FEEDBACK-TEMPLATEID');
  }

  async sendMailForContactForm(cmd: MailCommand): Promise<boolean> {
    this.logger.debug(`About to send email ${JSON.stringify(cmd)}`);

    axios.defaults.headers.post['Authorization'] = 'Bearer ' + this.sendGridKey;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    const messageToAdmin = {
      personalizations: [{ to: [{ email: this.emailFeedback }] }],

      from: { email: cmd.fromEmail },
      subject: cmd.subject,
      content: [
        {
          type: 'text/plain',
          value: cmd.message
        }
      ]
    };
    await this.sendMail(messageToAdmin);

    // We also send an email with Fouly branding to the person who sent us the feedback
    const messageToCustomer = {
      personalizations: [{ to: [{ email: cmd.fromEmail }] }],
      from: { email: this.emailFeedback },
      reply_to: {
        email: this.emailFeedback,
        name: 'Fouly'
      },
      subject: 'Fouly vous remercie !', //TODO; translation, think we need one template per locale. Subject is not customizable with prop
      template_id: this.feedbackTemplateId
    };
    await this.sendMail(messageToCustomer);
    return true;
  }

  async sendMailForRegisterBusinessForm(
    cmd: RegisterBusinessMailCommand,
    correlationId: string
  ): Promise<boolean> {
    this.logger.debug(`About to send email for business registration ${JSON.stringify(cmd)}`);

    axios.defaults.headers.post['Authorization'] = 'Bearer ' + this.sendGridKey;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    const messageToAdmin = {
      personalizations: [{ to: [{ email: this.emailFeedback }] }],
      from: { email: cmd.email },
      subject: `Le commerce ${cmd.businessName} désir s'enregistrer pour Fouly Entreprises`,
      content: [
        {
          type: 'text/plain',
          value: `correlationId=${correlationId} 
                  https://fouly.ca/app/tabs/map/store-detail/${cmd.placeId}
        `
        }
      ]
    };
    await this.sendMail(messageToAdmin);

    // We also send an email with Fouly branding to the person who sent us the feedback

    // const messageToCustomer = {
    //   personalizations: [{ to: [{ email: cmd.fromEmail }] }],
    //   from: { email: this.emailFeedback },
    //   reply_to: {
    //     email: this.emailFeedback,
    //     name: 'Fouly'
    //   },
    //   subject: 'Fouly vous remercie !', //TODO; translation, think we need one template per locale. Subject is not customizable with prop
    //   template_id: this.feedbackTemplateId
    // };
    // await this.sendMail(messageToCustomer);
    return true;
  }

  private async sendMail(message: any) {
    try {
      const answer = await axios.post(this.sendGridUrl, message);
      this.logger.verbose(answer);
    } catch (err) {
      this.logger.error('There was an error calling axios.post', err);
      throw new BadRequestException();
    }
  }
}
