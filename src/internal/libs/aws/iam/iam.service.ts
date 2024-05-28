import { Inject, Injectable } from '@nestjs/common';
import { AccountIdPositionFromArn, IamProviderName } from '@/internal/libs/aws/iam/constants';
import { IAM } from 'aws-sdk';
import { get } from 'lodash';

@Injectable()
export class IamService {
  constructor(@Inject(IamProviderName) private readonly iam: IAM) {}

  async getUser() {
    return this.iam.getUser().promise();
  }

  async getArn(): Promise<string> {
    const user = await this.getUser();
    return get(user, ['User', 'Arn']);
  }

  getAccountIdFromArn(arn: string): number {
    const pieces = arn.split(':');
    return Number(get(pieces, AccountIdPositionFromArn));
  }
}
