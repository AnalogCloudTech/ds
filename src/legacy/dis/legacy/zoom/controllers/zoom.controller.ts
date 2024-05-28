import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  RecordingCompletedDto,
  ZoomCallFilter,
  ZoomCoachType,
  ZoomEmailType,
  ZoomMeetingFilter,
  ZoomMemberDetails,
  ZoomRecordingObject,
} from '@/legacy/dis/legacy/zoom/dto/recording-completed.dto';
import { ZoomService } from '@/legacy/dis/legacy/zoom/zoom.service';
import * as express from 'express';
import { ApiKeyOnly, Public } from '@/auth/auth.service';
import { ZoomRecordingDocument } from '@/legacy/dis/legacy/zoom/schemas/zoom.schema';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import {
  Zoom as DomainZoom,
  ZoomMember as DomainZoomMember,
} from '@/legacy/dis/legacy/zoom/domain/zoom';
import { ZoomAwsSignedUrl, ZoomId } from '../domain/types';
import { ZoomMemberDocument } from '../schemas/zoom-member.schema';
import { PaginatorSchemaInterface } from '@/internal/utils/paginator/paginator.schema';
import { CallLogResponse } from '../dto/callLog';

@Controller({ path: 'zoom', version: '1' })
export class ZoomController {
  constructor(
    private zoomService: ZoomService,
    @Inject('ZOOM_JWT_TOKEN') private readonly jwt,
  ) {}

  @Post('phone/recording')
  async createHSCallRecord(
    @Body() recordingCompletedDto: RecordingCompletedDto,
  ) {
    return this.zoomService.handleRecordingCompleted(recordingCompletedDto);
  }

  @Public()
  @Get('phone/recording/:id')
  async redirectToAudioFile(
    @Res() res: express.Response,
    @Req() req: express.Request,
    @Param('id') id: string,
  ): Promise<void> {
    const audioUrl = this.zoomService.getRecordingAudioUrl(id);
    const { access_token } = await this.zoomService.getAuthToken();
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Authorization', `Bearer ${access_token}`);
    return res.redirect(HttpStatus.SEE_OTHER, audioUrl);
  }

  @ApiKeyOnly()
  @Post('screen/recording-download')
  async zoomRecordingDownload(
    @Body() recordingData: ZoomRecordingObject,
  ): Promise<ZoomRecordingDocument> {
    return this.zoomService.handleZoomRecordingCompleted(recordingData);
  }

  @Serialize(DomainZoom)
  @Get('screen-recording/get-records/:email')
  async screenRecordingGetRecords(
    @Param('email') email: string,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Query(ValidationTransformPipe)
    filter: ZoomMeetingFilter,
  ): Promise<PaginatorSchematicsInterface<ZoomRecordingDocument>> {
    return this.zoomService.screenRecordingGetRecords(
      email,
      page,
      perPage,
      filter,
    );
  }

  @Get('screen-recording/play-video/:id')
  screenRecordingPlayVideo(@Param('id') id: ZoomId): Promise<ZoomAwsSignedUrl> {
    return this.zoomService.screenRecordingPlayVideo(id);
  }

  @Get('phone-call/zoom-user')
  phoneCallZoomUser(
    @Query(ValidationTransformPipe) { email }: ZoomEmailType,
  ): Promise<ZoomCoachType> {
    return this.zoomService.phoneCallZoomUser(email);
  }

  @Get('phone-call/get-call-logs/:email/:nextPageToken')
  getCallLogs(
    @Param('email') email: string,
    @Param('nextPageToken') nextPageToken: string,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Query(ValidationTransformPipe)
    filter: ZoomCallFilter,
  ): Promise<PaginatorSchemaInterface<CallLogResponse>> {
    return this.zoomService.getCallLogs(
      email,
      page,
      perPage,
      filter,
      nextPageToken,
    );
  }

  @Get('phone-call/download-call/:id')
  async downloadCall(@Param('id') id: string): Promise<string> {
    const url = await this.zoomService.downloadCall(id);
    return url;
  }

  @Get('screen-recording/get-coaches-list')
  getCoachesList(
    @Query(ValidationTransformPipe) { email }: ZoomEmailType,
  ): Promise<ZoomCoachType> {
    return this.zoomService.getCoachesList(email);
  }

  @Serialize(DomainZoomMember)
  @Get('zoom-member/member-property')
  async getZoomMemberDetailsByEmail(
    @Query(ValidationTransformPipe) { email }: ZoomEmailType,
  ): Promise<ZoomMemberDocument> {
    return this.zoomService.zoomMemberGetRecords(email);
  }

  @Serialize(DomainZoomMember)
  @Get('zoom-member/all-member-property')
  getAllMemberRecords(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ): Promise<PaginatorSchematicsInterface<ZoomMemberDocument>> {
    return this.zoomService.getAllMemberRecords(page, perPage);
  }

  @Serialize(DomainZoomMember)
  @Post('zoom-member/add-member-property')
  zoomMemberRecordAdd(
    @Body() recordingData: ZoomMemberDetails,
  ): Promise<ZoomMemberDocument> {
    return this.zoomService.zoomMemberRecordAdd(recordingData);
  }

  @Serialize(DomainZoomMember)
  @Patch('zoom-member/update-member-property')
  zoomMemberRecordUpdate(
    @Body() recordingData: ZoomMemberDetails,
  ): Promise<ZoomMemberDocument> {
    return this.zoomService.zoomMemberRecordUpdate(recordingData);
  }

  @Serialize(DomainZoomMember)
  @Delete('zoom-member/delete-member-property/:id')
  zoomMemberRecordDelete(@Param('id') id: ZoomId): Promise<ZoomMemberDocument> {
    return this.zoomService.zoomMemberRecordDelete(id);
  }
}
