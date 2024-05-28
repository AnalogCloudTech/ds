import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Axios } from 'axios';

interface PublicationResponse {
  success: boolean;
  publication: {
    id: string;
    links: Array<{
      rel: string;
      type: 'GET' | 'POST' | 'DELETE';
      href: string;
    }>;
    state: string;
    seoEnabled: boolean;
    name: string;
    description: string;
    hashId: string;
    lastPdfName: string;
    contentRoot: string;
    canonicalLink: string;
    modificationTime: string;
    creationTime: string;
    isDemoPublication: boolean;
    totalPages: number;
    customizationOptions: {
      password: string;
      hardcoverEnabled: boolean;
      companyLogoEnabled: boolean;
      companyLogoUrl: string;
      rtlEnabled: boolean;
      theme: string;
    };
  };
}

@Injectable()
export class FlippingBookService {
  constructor(
    @Inject('HTTP_FLIPPING_API')
    private readonly api: Axios,
  ) {}

  /**
   * Get publication by publicationId
   * @param publicationId - publication identifier
   *
   * @returns publication data
   *
   * @see {@link https://apidocs.flippingbook.com/#the-publication-entity}
   */
  public async getPublicationById(publicationId: string) {
    if (!publicationId) {
      throw new HttpException(
        {
          message: 'publicationId is required',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const { data } = await this.api.get<PublicationResponse>(
        `/publication/${publicationId}`,
      );
      return data;
    } catch (error) {
      throw new HttpException(
        {
          message: 'error while getting publication in flippingBook',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updatePublicationByHashId(
    hashId: string,
    payload: { url: string; name: string; description: string; domain: string },
  ) {
    if (!hashId) {
      throw new HttpException(
        {
          message: 'missing hashId',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const { data } = await this.api.post<PublicationResponse>(
        `/publication`,
        payload,
        {
          params: {
            hashid: hashId,
          },
        },
      );
      return data;
    } catch (error) {
      throw new HttpException(
        {
          message: 'error while getting publication in flippingBook',
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public getHashIdFromUrl(url: string) {
    try {
      const splitArr = url.split('/');
      return splitArr.at(-1).length ? splitArr.at(-1) : splitArr.at(-2);
    } catch (error) {
      throw new HttpException(
        { message: 'could not find hashId for publication', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
