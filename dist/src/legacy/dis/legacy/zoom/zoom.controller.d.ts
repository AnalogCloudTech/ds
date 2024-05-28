import { RecordingCompletedDto, ZoomCallFilter, ZoomCoachType, ZoomEmailType, ZoomMeetingFilter, ZoomMemberDetails, ZoomRecordingObject } from '@/legacy/dis/legacy/zoom/dto/recording-completed.dto';
import { ZoomService } from '@/legacy/dis/legacy/zoom/zoom.service';
import * as express from 'express';
import { ZoomRecordingDocument } from '@/legacy/dis/legacy/zoom/schemas/zoom.schema';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { ZoomAwsSignedUrl, ZoomId } from './domain/types';
import { ZoomMemberDocument } from './schemas/zoom-member.schema';
import { PaginatorSchemaInterface } from '@/internal/utils/paginator/paginator.schema';
import { CallLogResponse } from './dto/callLog';
export declare class ZoomController {
    private zoomService;
    private readonly jwt;
    constructor(zoomService: ZoomService, jwt: any);
    createHSCallRecord(recordingCompletedDto: RecordingCompletedDto): Promise<void[] | {
        plainToken: string;
        encryptedToken: string;
    }>;
    redirectToAudioFile(res: express.Response, req: express.Request, id: string): Promise<void>;
    zoomRecordingDownload(recordingData: ZoomRecordingObject): Promise<ZoomRecordingDocument>;
    screenRecordingGetRecords(email: string, { page, perPage }: Paginator, filter: ZoomMeetingFilter): Promise<PaginatorSchematicsInterface<ZoomRecordingDocument>>;
    screenRecordingPlayVideo(id: ZoomId): Promise<ZoomAwsSignedUrl>;
    phoneCallZoomUser({ email }: ZoomEmailType): Promise<ZoomCoachType>;
    getCallLogs(email: string, nextPageToken: string, { page, perPage }: Paginator, filter: ZoomCallFilter): Promise<PaginatorSchemaInterface<CallLogResponse>>;
    downloadCall(id: string): Promise<string>;
    getCoachesList({ email }: ZoomEmailType): Promise<ZoomCoachType>;
    getZoomMemberDetailsByEmail({ email }: ZoomEmailType): Promise<ZoomMemberDocument>;
    getAllMemberRecords({ page, perPage }: Paginator): Promise<PaginatorSchematicsInterface<ZoomMemberDocument>>;
    zoomMemberRecordAdd(recordingData: ZoomMemberDetails): Promise<ZoomMemberDocument>;
    zoomMemberRecordUpdate(recordingData: ZoomMemberDetails): Promise<ZoomMemberDocument>;
    zoomMemberRecordDelete(id: ZoomId): Promise<ZoomMemberDocument>;
}
