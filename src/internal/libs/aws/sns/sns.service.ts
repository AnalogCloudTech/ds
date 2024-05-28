import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SnsProviderName } from '@/internal/libs/aws/sns/contants';
import { SNS } from 'aws-sdk';

@Injectable()
export class SnsService {
  constructor(@Inject(SnsProviderName) protected readonly sns: SNS) {}

  public async publish<T>(message: T, topicName: string) {
    const topicArn = await this.getTopicArn(topicName);

    if (!topicArn) {
      throw new HttpException(
        { message: 'SNS topic not found' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.sns
      .publish({
        TopicArn: topicArn.TopicArn,
        Message: JSON.stringify(message),
      })
      .promise()
      .catch((err) => {
        if (err instanceof Error) {
          throw new HttpException(
            { message: err },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
  }

  private async getTopicArn(topicName: string) {
    const topicList = await this.listAllTopics();

    return topicList.find((t) => {
      const arn = t.TopicArn.split(':');
      const name = arn[arn.length - 1];
      return name === topicName;
    });
  }

  private async listAllTopics(): Promise<SNS.TopicsList> {
    const topics: SNS.TopicsList = [];
    let next: string = null;

    do {
      const result = await this.sns.listTopics({ NextToken: next }).promise();
      next = result.NextToken;
      topics.push(...result.Topics);
    } while (next);

    return topics;
  }
}
