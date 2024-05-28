import { Logger } from '@nestjs/common';
import { api, setAccessToken } from 'fb';
import { forEach } from 'lodash';

export class CommonHelpers {
  async postFBMessage(data, attributes) {
    forEach(attributes, async (attr) => {
      setAccessToken(`${attr.securityKey}`);
      await this.fbPost(attr, data);
    });
  }

  async fbPost(attributes, result) {
    try {
      const url = `/${attributes.pageAddress}/photos`;
      await api(url, 'POST', {
        url: `${result.image}`,
        message: result.content,
      });
    } catch (error: any) {
      Logger.error(
        `Customer ${attributes.customerId._id} `,
        error.response.error.message,
      );
    }
  }
}
