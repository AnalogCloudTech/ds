import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SES } from 'aws-sdk';
import { inspect } from 'util';
import {
  buildTemplateName,
  DefaultCustomVerificationEmailTemplate,
  SesProviderName,
} from '@/internal/libs/aws/ses/constants';
import { Lead } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty, isUndefined } from 'lodash';
import { IamService } from '@/internal/libs/aws/iam/iam.service';
import { hash as hashFunction } from 'bcryptjs';
import { CreateCustomVerificationEmailDto } from '@/internal/libs/aws/ses/dto/create-custom-verification-email.dto';
import { UpdateCustomVerificationEmailDto } from '@/internal/libs/aws/ses/dto/update-custom-verification-email.dto';
import { replaceTags } from '@/internal/utils/aws/ses/replaceTags';
import { EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { EmailReminder } from '@/onboard/dto/email-reminder.dto';

@Injectable()
export class SesService {
  constructor(
    @Inject(SesProviderName) protected readonly ses: SES,
    private readonly configService: ConfigService,
    private readonly iamService: IamService,
    private readonly logger: Logger,
  ) {
  }

  async sendSingleEmail(params: SES.SendEmailRequest) {
    return this.ses.sendEmail(params).promise();
  }

  /**
   * @deprecated
   */
  async buildSingleEmailParams(
    emailReminder: EmailReminder,
  ): Promise<SES.SendEmailRequest> {
    // TODO: need refactor
    const templateName = buildTemplateName(
      this.configService.get('reminderTemplate.templateId'),
    );

    const templateData = await this.getTemplateData(templateName);
    const body = get(templateData, ['Template', 'HtmlPart']);
    const bodyReplaced = replaceTags(body, {
      '{{CUSTOMER_NAME}}': emailReminder.customerName,
      '{{COACH_NAME}}': emailReminder.coachName,
      '{{ZOOM_LINK}}': emailReminder.zoomLink,
      '{{MEETING_DATE_TIME}}': emailReminder.dateTime,
    });

    return {
      Source: emailReminder.coachEmail,
      Destination: {
        ToAddresses: [emailReminder.customerEmail],
        BccAddresses: this.configService.get(
          'aws.ses.bccAddresses.emailReminder',
        ),
      },
      Message: {
        Body: {
          Html: {
            Data: bodyReplaced,
          },
        },
        Subject: {
          Data: emailReminder.subject,
        },
      },
      ConfigurationSetName: this.configService.get('aws.ses.config.default'),
    };
  }

  async buildEmailReminderParams(
    emailReminder: EmailReminderDocument,
  ): Promise<SES.SendEmailRequest> {
    try {
      const templateName = buildTemplateName(
        this.configService.get('reminderTemplate.templateId'),
      );

      const templateData = await this.getTemplateData(templateName);
      const customer = <CustomerDocument>emailReminder.customer;
      const coach = <CoachDocument>emailReminder.coach;
      const body = get(templateData, ['Template', 'HtmlPart']);
      const bodyReplaced = replaceTags(body, {
        '{{CUSTOMER_NAME}}': customer.firstName,
        '{{COACH_NAME}}': coach.name,
        '{{ZOOM_LINK}}': emailReminder.meetingLink,
        '{{MEETING_DATE_TIME}}': emailReminder.meetingDateFormatted,
      });

      return {
        Source: get(coach, 'email'),
        Destination: {
          ToAddresses: [customer.email],
          BccAddresses: this.configService.get(
            'aws.ses.bccAddresses.emailReminder',
          ),
        },
        Message: {
          Body: {
            Html: {
              Data: bodyReplaced,
            },
          },
          Subject: {
            Data: emailReminder.subject,
          },
        },
        ConfigurationSetName: this.configService.get('aws.ses.config.default'),
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new HttpException(
          { message: err.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  getTemplateData(templateName: string): Promise<SES.GetTemplateResponse> {
    const templateRequest = <SES.GetTemplateRequest>{
      TemplateName: templateName,
    };
    return this.ses.getTemplate(templateRequest).promise();
  }

  async listVerifiedEmailAddresses() {
    return this.ses.listVerifiedEmailAddresses().promise();
  }

  async validateEmail(email: string): Promise<boolean> {
    const data = await this.ses.getIdentityVerificationAttributes({
      Identities: [email],
    }).promise();

    return !isEmpty(data.VerificationAttributes) && data.VerificationAttributes[email].VerificationStatus === 'Success'
  }

  async emailIsVerified(email: string): Promise<boolean> {
    return this.validateEmail(email);
  }

  buildParamsFromLeads(
    source,
    templateName,
    leads: Lead[],
    attributes?: object,
  ): SES.SendBulkTemplatedEmailRequest {
    const defaultTemplateData = JSON.stringify({
      LEAD_FIRST_NAME: 'There',
      LEAD_LAST_NAME: '',
      LEAD_EMAIL: '',
      LEAD_UNSUBSCRIBE_URL: '',
      BROKER_ADDRESS: '',
      PROFILE_IMAGE: '',
      MEMBER_FIRST_NAME: '',
      MEMBER_LAST_NAME: '',
      MEMBER_TITLE: '',
      MEMBER_BROKER_NAME: '',
      MEMBER_ADDRESS: '',
      MEMBER_PHONE: '',
      MEMBER_PROFILE_IMAGE: '',
      MEMBER_EMAIL: '',
      MEMBER_BOOK_URL: '',
    });
    const extraAttributes = {
      BROKER_ADDRESS: get(attributes, 'brokerAddress'),
      PROFILE_IMAGE: get(attributes, 'imageUrl'),
      MEMBER_FIRST_NAME: get(attributes, 'memberFirstName'),
      MEMBER_LAST_NAME: get(attributes, 'memberLastName'),
      MEMBER_TITLE: get(attributes, 'memberTitle'),
      MEMBER_BROKER_NAME: get(attributes, 'memberBrokerName'),
      MEMBER_ADDRESS: get(attributes, 'memberAddress'),
      MEMBER_PHONE: get(attributes, 'memberPhone'),
      MEMBER_PROFILE_IMAGE: get(attributes, 'memberProfileImage'),
      MEMBER_EMAIL: get(attributes, 'memberEmail'),
      MEMBER_BOOK_URL: get(attributes, 'memberBookUrl'),
    };

    return <SES.SendBulkTemplatedEmailRequest>{
      Source: source,
      Template: templateName,
      Destinations: leads.map((item: Lead) => {
        const { email, firstName, lastName } = item;
        const templateData = {
          LEAD_FIRST_NAME: firstName,
          LEAD_LAST_NAME: lastName,
          LEAD_EMAIL: email,
          LEAD_UNSUBSCRIBE_URL: this.generateRouteForUnsubscribe(
            get(item, '_id'),
          ),
        };
        Object.keys(extraAttributes).forEach((key) => {
          if (
            !isEmpty(extraAttributes[key]) &&
            !isUndefined(extraAttributes[key])
          ) {
            templateData[key] = extraAttributes[key];
          }
        });

        return {
          Destination: {
            ToAddresses: [email],
          },
          ReplacementTemplateData: JSON.stringify(templateData),
        };
      }),
      ConfigurationSetName: this.configService.get('aws.ses.config.default'),
      DefaultTemplateData: defaultTemplateData,
    };
  }

  async sendBulkTemplatedEmail(
    params: SES.SendBulkTemplatedEmailRequest,
  ): Promise<SES.SendBulkTemplatedEmailResponse> {
    return this.ses.sendBulkTemplatedEmail(params).promise();
  }

  async setPolicy(email: string) {
    const region = this.configService.get<string>('aws.region');
    const arn = await this.iamService.getArn();
    const accountId = this.iamService.getAccountIdFromArn(arn);
    const sid = await this.buildStatementSid(email);
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: sid,
          Effect: 'Allow',
          Principal: {
            AWS: arn,
          },
          Action: [
            'ses:SendEmail',
            'ses:SendRawEmail',
            'ses:SendTemplatedEmail',
            'ses:SendBulkTemplatedEmail',
          ],
          Resource: this.buildResourceIdentity(region, accountId, email),
          Condition: {},
        },
      ],
    };
    const params = <SES.Types.PutIdentityPolicyRequest>{
      Identity: email,
      PolicyName: 'send-mails-policy',
      Policy: JSON.stringify(policy),
    };

    return this.ses.putIdentityPolicy(params).promise();
  }

  async sendVerificationEmail(email: string) {
    const data = <SES.Types.SendCustomVerificationEmailRequest>{
      EmailAddress: email,
      TemplateName: DefaultCustomVerificationEmailTemplate,
    };
    await this.ses.sendCustomVerificationEmail(data).promise();
    await this.setPolicy(email);
  }

  async createTemplate(
    name: string,
    subject: string,
    html: string,
  ): Promise<SES.CreateTemplateResponse> {
    const template = <SES.CreateTemplateRequest>{
      Template: <SES.Template>{
        TemplateName: name,
        SubjectPart: subject,
        HtmlPart: html,
      },
    };
    return this.ses
      .createTemplate(template)
      .promise()
      .then(
        function(result) {
          //@ts-ignore
          this.logger.log(`Created template on SES ${inspect(result)}`);
        }.bind(this),
      );
  }

  async updateTemplate(
    name: string,
    subject: string,
    html: string,
  ): Promise<SES.UpdateTemplateResponse> {
    const request: SES.UpdateTemplateRequest = {
      Template: <SES.Template>{
        TemplateName: name,
        SubjectPart: subject,
        HtmlPart: html,
      },
    };
    return this.ses
      .updateTemplate(request)
      .promise()
      .then(
        function(result) {
          //@ts-ignore
          this.logger.log(`Updated template on SES ${inspect(result)}`);
        }.bind(this),
      );
  }

  async templateDetails(template: string): Promise<SES.GetTemplateResponse> {
    const request = <SES.GetTemplateRequest>{
      TemplateName: template,
    };
    const response = await this.ses.getTemplate(request).promise();

    return response;
  }

  async deleteTemplate(name: string) {
    const deleteRequest = <SES.DeleteTemplateRequest>{
      TemplateName: name,
    };

    return this.ses
      .deleteTemplate(deleteRequest)
      .promise()
      .then(
        function(result) {
          //@ts-ignore
          this.logger.log(`Deleted template from SES ${inspect(result)}`);
        }.bind(this),
      );
  }

  async createDefaultCustomVerificationEmailTemplate(
    dto: CreateCustomVerificationEmailDto,
  ) {
    const request: SES.Types.CreateCustomVerificationEmailTemplateRequest = {
      // @TODO improve when we need the full feature
      TemplateName: DefaultCustomVerificationEmailTemplate,
      FromEmailAddress: dto.fromEmail,
      TemplateSubject: dto.subject,
      TemplateContent: dto.content,
      SuccessRedirectionURL: dto.successRedirectUrl,
      FailureRedirectionURL: dto.failureRedirectUrl,
    };
    return this.ses.createCustomVerificationEmailTemplate(request).promise();
  }

  async getCustomVerificationEmailTemplate(
    name,
  ): Promise<SES.Types.CustomVerificationEmailTemplate> {
    const request: SES.Types.GetCustomVerificationEmailTemplateRequest = {
      TemplateName: name,
    };
    try {
      const template = await this.ses
        .getCustomVerificationEmailTemplate(request)
        .promise();

      return template;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async updateDefaultCustomVerificationEmailTemplate(
    name: string,
    dto: UpdateCustomVerificationEmailDto,
  ) {
    const request: SES.Types.UpdateCustomVerificationEmailTemplateRequest = {
      // @TODO improve when we need the full feature
      TemplateName: name,
      FromEmailAddress: dto.fromEmail,
      TemplateSubject: dto.subject,
      TemplateContent: dto.content,
      SuccessRedirectionURL: dto.successRedirectUrl,
      FailureRedirectionURL: dto.failureRedirectUrl,
    };
    await this.getCustomVerificationEmailTemplate(name);

    return this.ses.updateCustomVerificationEmailTemplate(request).promise();
  }

  generateRouteForUnsubscribe(leadID: string): string {
    return <string>(
      this.configService.get('aws.ses.unsubscribe').replace(/:id/, leadID)
    );
  }

  private buildResourceIdentity(
    region: string,
    accountId: number,
    identity: string,
  ): string {
    return `arn:aws:ses:${region}:${accountId}:identity/${identity}`;
  }

  private async buildStatementSid(sidSource: string) {
    const hash = await hashFunction(sidSource, 13);
    return `stmt${hash}`;
  }
}
