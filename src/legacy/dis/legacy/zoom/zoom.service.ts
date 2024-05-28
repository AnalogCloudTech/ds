import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { find, get } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { HubspotService } from '../hubspot/hubspot.service';
import { S3Service } from '@/internal/libs/aws/s3/s3.service';
import {
  AccessTokenResponse,
  CallLogDto,
  CallLogResponse,
  CallRecording,
  UrlParamsCallLog,
} from './dto/callLog';
import {
  RecordingCompletedDto,
  RecordingCompletedPayloadObjectDto,
  ZoomAuthTypes,
  ZoomCallFilter,
  ZoomCoachType,
  ZoomMeetingFilter,
  ZoomMemberDetails,
  ZoomPhoneUserDetails,
  ZoomRecordingObject,
  ZoomUserTypes,
} from './dto/recording-completed.dto';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import {
  CONTEXT_ZOOM_CALL_RECORDING,
  CONTEXT_ZOOM_CLOUD_MEETING_DELETE,
  CONTEXT_ZOOM_MEETING_DELETE,
} from '@/internal/common/contexts';
import { ZoomDsRepository } from './zoom.repository';
import { ZoomRecordingDocument } from './schemas/zoom.schema';
import { FilterQuery, QueryOptions } from 'mongoose';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { ZoomAwsSignedUrl, ZoomId } from './domain/types';
import { SchemaId } from '@/internal/types/helpers';
import { ZoomMemberDocument } from './schemas/zoom-member.schema';
import { ZoomMemberRepository } from './zoom-member.repository';
import jwtToken from 'jsonwebtoken';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import {
  ZOOM_API_KEY,
  ZOOM_SECRET_KEY,
  ZOOMAPI_PROVIDER_NAME,
} from './constants';
import { createHmac } from 'crypto';
import { ZoomPhoneUserRepository } from './zoom-phone-user.repository';
import { paramsStringify } from '@/internal/utils/url';
import { PaginatorSchemaInterface } from '@/internal/utils/paginator/paginator.schema';
import { ZoomPhoneUserDocument } from './schemas/zoom-phone-user.schema';

@Injectable()
export class ZoomService {
  phoneRecordingPath = 'v1/zoom/phone/recording/';

  constructor(
    @Inject('INTEGRATION_SERVICES_URL') private readonly integrationServicesUrl,
    @Inject(ZOOMAPI_PROVIDER_NAME) private readonly http: Axios,
    @Inject('ZOOM_SERVER_O_URL') private readonly zoomServerOAuthUrl: string,
    @Inject('ZOOM_BASIC_TOKEN') private readonly basicToken: string,
    @Inject('ZOOM_SECRET_TOKEN') private readonly zoomSecretToken: string,
    @Inject(ZOOM_API_KEY)
    private readonly apiKey: string,
    @Inject(ZOOM_SECRET_KEY)
    private readonly apiSecret: string,
    private readonly hubspotService: HubspotService,
    private readonly s3Service: S3Service,

    @Inject('REVERSE_PROXY_URL')
    private readonly reverseProxyUrl: string,
    private readonly zoomDsRepository: ZoomDsRepository,
    private readonly zoomMemberRepository: ZoomMemberRepository,
    private readonly zoomPhoneUserRepository: ZoomPhoneUserRepository,
    private httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  async handleRecordingCompleted(data: RecordingCompletedDto) {
    if (data.event === 'endpoint.url_validation') {
      return this.urlValidate(data);
    }
    const recordings = data.payload.object.recordings;
    const payloadObject = recordings[0];
    const contactInfo = this.getContactInfo(payloadObject);
    const downloadUrls = this.getDownloadUrls(recordings);
    if (contactInfo?.number?.length > 3) {
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            payloadObject,
            contactInfo,
            downloadUrls,
            usageDate: DateTime.now(),
            method: 'handleRecordingCompleted',
            message: 'Zoom Call Recording Payload',
          },
        },
        CONTEXT_ZOOM_CALL_RECORDING,
      );

      const hubspotContact = await this.hubspotService.getContactByPhoneNumber(
        contactInfo.number,
      );
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            hubspotContact,
            usageDate: DateTime.now(),
            method: 'handleRecordingCompleted',
            message: 'Zoom Call Find HubSpot Contact using number',
          },
        },
        CONTEXT_ZOOM_CALL_RECORDING,
      );
      let hubspotContactId = <string>(
        get(hubspotContact, ['body', 'results', '0', 'id'], null)
      );
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            hubspotContactId,
            usageDate: DateTime.now(),
            method: 'handleRecordingCompleted',
            message: 'HubSpot Contact ID',
          },
        },
        CONTEXT_ZOOM_CALL_RECORDING,
      );
      if (!hubspotContactId) {
        const createdHubspotContact = await this.hubspotService.createContact(
          contactInfo.number,
          contactInfo.name,
        );
        hubspotContactId = createdHubspotContact.body.id;
        /* LOG */
        this.logger.log(
          {
            payload: <LoggerPayload>{
              createdHubspotContact,
              usageDate: DateTime.now(),
              method: 'handleRecordingCompleted',
              message: 'HubSpot contact created',
            },
          },
          CONTEXT_ZOOM_CALL_RECORDING,
        );
      }

      const zoomUserId = await this.getZoomUserId(payloadObject);
      const zoomUser = await this.getUser(zoomUserId);
      const zoomUserEmail = get(zoomUser, ['email']);
      const hsOwnerId = await this.hubspotService.getOwnerByEmail(
        zoomUserEmail,
      );
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            zoomUserId,
            zoomUser,
            zoomUserEmail,
            hsOwnerId,
            usageDate: DateTime.now(),
            method: 'handleRecordingCompleted',
            message: 'Zoom User Info & HubSpot Contact ID',
          },
        },
        CONTEXT_ZOOM_CALL_RECORDING,
      );
      const calls = downloadUrls.map((url) => {
        return this.hubspotService.createCallEngagement(
          hubspotContactId,
          url,
          payloadObject,
          hsOwnerId,
        );
      });
      return await Promise.all(calls);
    }
    this.logger.log({
      payload: <LoggerPayload>{
        contactInfo,
        usageDate: DateTime.now(),
        method: 'handleRecordingCompleted',
        message: 'Caller Number is Null OR having 3 digits',
      },
    });
    return null;
  }

  public deleteAllS3Object(bucketName: string, keyData: { Key: string }[]) {
    return this.s3Service.deleteS3Object(bucketName, keyData);
  }

  public deleteRecords(idsDelete: SchemaId[]) {
    return this.zoomDsRepository.deleteManyRecords(idsDelete);
  }

  async getZoomUserId(
    payload: RecordingCompletedPayloadObjectDto,
  ): Promise<string> {
    const { type, id } = get(payload, ['owner']);
    const callId = get(payload, ['call_id']);
    if (type === 'user') {
      return id;
    }

    const { log_details: logs } = await this.getCallLog(callId);
    const log = find(logs, (log) => {
      const result = <string>get(log, ['result'], '');
      const type = <string>get(log, ['forward_to', 'type']);
      return result === 'Call connected' && type === 'user';
    });

    if (!log) {
      throw new HttpException(
        {
          message: `Couldnt find the zoom user id for call ID number: ${callId}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return <string>get(log, ['forward_to', 'id']);
  }

  getRecordingAudioUrl(id: string): string {
    return `${this.reverseProxyUrl}${id}`;
  }

  getContactInfo({
    caller_number,
    callee_number,
    callee_name,
    caller_name,
    direction,
  }: {
    caller_number: string;
    callee_number: string;
    callee_name: string;
    caller_name: string;
    direction: string;
  }) {
    switch (direction) {
      case 'outbound':
        return { number: callee_number, name: callee_name };
      case 'inbound':
        return { number: caller_number, name: caller_name };
      default:
        break;
    }
  }

  private async getCallLog(id: string): Promise<CallLogDto> {
    const { access_token } = await this.getAuthToken();
    const url = `/v2/phone/call_logs/${id}`;
    const request = this.httpService.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const response = await firstValueFrom(request);
    return <CallLogDto>get(response, ['data']);
  }

  public async downloadCall(id: string): Promise<string> {
    const response = await this.getCallLogById(id);
    return response.file_url;
  }

  private async getCallLogById(id: string): Promise<CallRecording> {
    const { access_token } = await this.getAuthToken();
    const url = `phone/call_logs/${id}/recordings`;
    try {
      const request: AxiosResponse = await this.http.get<CallRecording>(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return <CallRecording>request.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(
          {
            message: 'Error while retrieveing call log data records',
            method: 'getCallLogById',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async getCallLogByEmail(
    id: string,
    from: string,
    to: string,
    nextPageToken: string,
    page: number,
    perPage: number,
  ): Promise<CallLogResponse> {
    const { access_token } = await this.getAuthToken();
    const urlParams: UrlParamsCallLog = {
      from: from,
      to: to,
      page_size: perPage.toString(),
    };
    if (nextPageToken !== 'first') {
      urlParams.next_page_token = nextPageToken;
    }
    const params = paramsStringify(urlParams);
    const url = `phone/users/${id}/call_logs?` + params;
    try {
      const request: AxiosResponse = await this.http.get<CallLogResponse>(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return <CallLogResponse>request.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(
          {
            message: 'Error while retrieveing call recording by ID',
            method: 'getCallLogByEmail',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private async getUser(id: string): Promise<ZoomUserTypes> {
    const { access_token } = await this.getAuthToken();
    const url = `/v2/users/${id}`;
    const request = this.httpService.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const response = await firstValueFrom(request);
    return <ZoomUserTypes>get(response, ['data']);
  }

  public async getAuthToken(): Promise<ZoomAuthTypes> {
    const headersRequest = {
      Authorization: `Basic ${this.basicToken}`,
    };
    const url = this.zoomServerOAuthUrl;
    const request = this.httpService.post(url, {}, { headers: headersRequest });
    const response = await firstValueFrom(request);
    return <AccessTokenResponse>get(response, ['data']);
  }

  public urlValidate(payload: RecordingCompletedDto) {
    const plainToken: string = payload.payload.plainToken;
    const hashForValidate = createHmac('sha256', this.zoomSecretToken)
      .update(plainToken)
      .digest('hex');

    const response = {
      plainToken: plainToken,
      encryptedToken: hashForValidate,
    };

    return response;
  }

  getDownloadUrls(recordings: RecordingCompletedPayloadObjectDto[]): string[] {
    return recordings.map((record) => {
      return this.buildDownloadUrl(record.download_url);
    });
  }

  buildDownloadUrl(zoomUrl: string): string {
    const domain = <string>this.integrationServicesUrl;
    const audioId = zoomUrl.split('download/')[1];
    const path = `${this.phoneRecordingPath}${audioId}`;
    const url = new URL(path, domain);
    return url.href;
  }

  public async handleZoomRecordingCompleted(
    data: ZoomRecordingObject,
  ): Promise<ZoomRecordingDocument> {
    const customerName = this.getCustomerName(data.topic);
    const filter: FilterQuery<ZoomRecordingDocument> = {
      hostEmail: data.host_email,
      zoomMeetinguuid: data.uuid,
    };
    const result = await this.zoomDsRepository.first(filter);
    if (result) {
      throw new HttpException(
        { message: 'This record already exists' },
        HttpStatus.OK,
      );
    }

    const zoomRecData = {
      hostEmail: data.host_email,
      fileLocation: data.file_location,
      bucketName: data.bucketName,
      keyName: data.keyName,
      topic: data.topic,
      startTime: data.start_time,
      customerName: customerName,
      zoomMeetingId: data.id,
      zoomMeetinguuid: data.uuid,
    };
    return this.zoomDsRepository.store(zoomRecData);
  }

  public async zoomMemberRecordAdd(
    zoomRecData: ZoomMemberDetails,
  ): Promise<ZoomMemberDocument> {
    return this.zoomMemberRepository.store(zoomRecData);
  }

  public async zoomPhoneUserAdd(
    zoomRecData: ZoomPhoneUserDetails,
  ): Promise<ZoomPhoneUserDocument> {
    return this.zoomPhoneUserRepository.store(zoomRecData);
  }

  public async zoomMemberRecordUpdate(
    zoomRecData: ZoomMemberDetails,
  ): Promise<ZoomMemberDocument> {
    return this.zoomMemberRepository.update(zoomRecData.id, zoomRecData);
  }

  public async zoomMemberRecordDelete(id: ZoomId): Promise<ZoomMemberDocument> {
    return this.zoomMemberRepository.delete(id);
  }

  public async getZoomVideoForDelete(): Promise<ZoomRecordingDocument[]> {
    const lastDay = DateTime.now().minus({ days: 90 }).toISO();
    const filter: FilterQuery<ZoomRecordingDocument> = {
      createdAt: { $lte: lastDay },
      deletedAt: null,
    };
    return this.zoomDsRepository.findAll(filter);
  }

  public async getZoomCloudVideoForDelete(): Promise<ZoomRecordingDocument[]> {
    const lastDay = DateTime.now().minus({ days: 30 }).toISO();
    const filter: FilterQuery<ZoomRecordingDocument> = {
      createdAt: { $lte: lastDay },
      zoomCloudDeletedAt: null,
    };
    return this.zoomDsRepository.findAll(filter);
  }

  public async deleteRecordingInZoom(
    meetingUuid: string,
    id: SchemaId,
  ): Promise<any> {
    const zoomAuthToken: ZoomAuthTypes = await this.getAuthToken();
    const token = zoomAuthToken.access_token;
    const url = `meetings/${meetingUuid}/recordings?action=delete`;

    try {
      const headersRequest = {
        Authorization: `Bearer ${token}`,
      };

      const response: AxiosResponse = await this.http.delete(url, {
        headers: headersRequest,
      });
      const zoomRecData = {
        zoomCloudDeletedAt: DateTime.now(),
      };
      await this.zoomDsRepository.update(id, zoomRecData);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        const payload: LoggerPayload = {
          usageDate: DateTime.now(),
          error: error.message,
          message: error.message,
        };
        this.logger.error({ payload }, '', CONTEXT_ZOOM_CLOUD_MEETING_DELETE);
      }
    }
  }

  public generateZoomToken() {
    const zoomPayload = {
      iss: this.apiKey,
      exp: new Date().getTime() + 10000,
    };
    return jwtToken.sign(zoomPayload, this.apiSecret);
  }

  private getCustomerName(topic: string): string {
    return topic.split(',')[0];
  }

  public async screenRecordingGetRecords(
    email: string,
    page: number,
    perPage: number,
    { topic, endDate, startDate }: ZoomMeetingFilter,
  ): Promise<PaginatorSchematicsInterface<ZoomRecordingDocument>> {
    const zoomMember = await this.zoomMemberRepository.findByEmail(email);

    if (!zoomMember || zoomMember?.zoomAppInstantDelete === true) {
      throw new Error('cannot retrieve zoom meeting for this user');
    }

    const filter = <FilterQuery<ZoomRecordingDocument>>{
      hostEmail: { $eq: email },
    };

    if (topic) {
      filter.topic = new RegExp(`${topic}`, 'i');
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: DateTime.fromISO(startDate).startOf('day'),
        $lte: DateTime.fromISO(endDate).endOf('day'),
      };
    }

    const options: QueryOptions = {
      skip: page * perPage,
      limit: perPage,
      lean: true,
      sort: { createdAt: -1 },
    };
    return this.zoomDsRepository.findAllPaginated(filter, options);
  }

  public async zoomMemberGetRecords(
    email: string,
  ): Promise<ZoomMemberDocument> {
    return this.zoomMemberRepository.findByEmail(email);
  }

  public async screenRecordingPlayVideo(id: ZoomId): Promise<ZoomAwsSignedUrl> {
    const zoomRecord = await this.zoomDsRepository.findById(id);
    if (!zoomRecord) {
      throw new HttpException(
        { message: 'Zoom Record not found' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const { bucketName, keyName } = zoomRecord;
    const response = {
      message: 'URL sent successfully',
      preSignedUrl: this.s3Service.preSignedDownload(bucketName, keyName),
    };
    return response;
  }

  public async shouldSkip(email: string) {
    const zoomUser = await this.zoomMemberRepository.findByEmail(email);
    return zoomUser?.zoomAppInstantDelete === true;
  }

  public async phoneCallZoomUser(email?: string): Promise<ZoomCoachType> {
    if (await this.shouldSkip(email)) {
      throw new Error('cannot list zoom member');
    }

    const coachRecord = await this.zoomPhoneUserRepository.getUniqueHostMail(
      email,
    );
    if (!coachRecord) {
      throw new HttpException(
        { message: 'Team Members List not found' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const response = {
      message: 'Team Members successfully sent',
      coachEmailList: coachRecord,
    };
    return response;
  }

  public async getCallLogs(
    email: string,
    page: number,
    perPage: number,
    { endDate, startDate }: ZoomCallFilter,
    nextPageToken: string,
  ): Promise<PaginatorSchemaInterface<CallLogResponse>> {
    const to = endDate || DateTime.now().toISODate();
    const from = startDate || DateTime.now().minus({ days: 30 }).toISODate();
    const request = await this.getCallLogByEmail(
      email,
      from,
      to,
      nextPageToken,
      page,
      perPage,
    );

    const formatResult = (result: string): string => {
      if (result === 'Call Cancel') {
        return 'Call Cancelled';
      }

      return result;
    };

    request.call_logs = request.call_logs.map((callLog) => {
      return <CallLogDto>{
        ...callLog,
        result: formatResult(callLog.result),
      };
    });

    return PaginatorSchema.buildResult<CallLogResponse>(
      request.total_records,
      request,
      page,
      perPage,
    );
  }

  public async getCoachesList(email?: string): Promise<ZoomCoachType> {
    const coachRecord = await this.zoomDsRepository.getUniqueHostMail(email);
    if (!coachRecord) {
      throw new HttpException(
        { message: 'DentistCoach List Record not found' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const excludeUsers = await this.zoomMemberRepository.findAll({
      zoomAppInstantDelete: true,
    });
    const excludeUsersEmails = excludeUsers.map((user) => user.hostEmail);
    const result = coachRecord.filter((c) => !excludeUsersEmails.includes(c));
    const response = {
      message: 'DentistCoach list successfully sent',
      coachEmailList: result,
    };
    return response;
  }

  public getAllMemberRecords(
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface<ZoomMemberDocument>> {
    const options: QueryOptions = {
      skip: page * perPage,
      limit: perPage,
      lean: true,
      sort: { createdAt: -1 },
    };
    return this.zoomMemberRepository.findAllPaginated({}, options);
  }

  async handleZoomS3Scheduler(): Promise<void> {
    const recordData = await this.getZoomVideoForDelete();
    if (recordData?.length) {
      const bucketName = recordData[0].bucketName;
      const keyData = recordData.map((item) => {
        return {
          Key: item.keyName,
        };
      });

      try {
        await this.deleteAllS3Object(bucketName, keyData);
        const idsDelete = recordData.map((item) => item._id);
        await this.deleteRecords(idsDelete);
      } catch (error) {
        if (error instanceof Error) {
          const payload: LoggerPayload = {
            usageDate: DateTime.now(),
            error: error?.message,
            stack: error?.stack,
            message: `Unable to delete the objects in AWS S3 `,
          };
          this.logger.error({ payload }, '', CONTEXT_ZOOM_MEETING_DELETE);
        }
      }
    }
    const payload: LoggerPayload = {
      usageDate: DateTime.now(),
      error: 'There is no records found',
      message: `There is no records found`,
    };
    this.logger.error({ payload }, '', CONTEXT_ZOOM_MEETING_DELETE);
  }

  async ZoomCloudScheduler(): Promise<void> {
    const recordData = await this.getZoomCloudVideoForDelete();
    if (recordData.length) {
      await Promise.all(
        recordData.map((item) => {
          const { zoomMeetinguuid, _id } = item;
          return this.deleteRecordingInZoom(zoomMeetinguuid, _id);
        }),
      );
    }
    const payload: LoggerPayload = {
      usageDate: DateTime.now(),
      error: 'There is no records found',
      message: `There is no records found`,
    };
    this.logger.error({ payload }, '', CONTEXT_ZOOM_CLOUD_MEETING_DELETE);
  }

  async listAllCoachesWithMeetingCount() {
    return this.zoomMemberRepository.listAllCoachesWithMeetingCount();
  }
}
