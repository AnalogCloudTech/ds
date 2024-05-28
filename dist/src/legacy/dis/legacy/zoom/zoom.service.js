"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const hubspot_service_1 = require("../hubspot/hubspot.service");
const s3_service_1 = require("../../../../internal/libs/aws/s3/s3.service");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../../internal/common/contexts");
const zoom_repository_1 = require("./zoom.repository");
const paginator_1 = require("../../../../internal/utils/paginator");
const zoom_member_repository_1 = require("./zoom-member.repository");
const jsonwebtoken_1 = require("jsonwebtoken");
const axios_2 = require("axios");
const constants_1 = require("./constants");
const crypto_1 = require("crypto");
const zoom_phone_user_repository_1 = require("./zoom-phone-user.repository");
const url_1 = require("../../../../internal/utils/url");
let ZoomService = class ZoomService {
    constructor(integrationServicesUrl, http, zoomServerOAuthUrl, basicToken, zoomSecretToken, apiKey, apiSecret, hubspotService, s3Service, reverseProxyUrl, zoomDsRepository, zoomMemberRepository, zoomPhoneUserRepository, httpService, logger) {
        this.integrationServicesUrl = integrationServicesUrl;
        this.http = http;
        this.zoomServerOAuthUrl = zoomServerOAuthUrl;
        this.basicToken = basicToken;
        this.zoomSecretToken = zoomSecretToken;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.hubspotService = hubspotService;
        this.s3Service = s3Service;
        this.reverseProxyUrl = reverseProxyUrl;
        this.zoomDsRepository = zoomDsRepository;
        this.zoomMemberRepository = zoomMemberRepository;
        this.zoomPhoneUserRepository = zoomPhoneUserRepository;
        this.httpService = httpService;
        this.logger = logger;
        this.phoneRecordingPath = 'v1/zoom/phone/recording/';
    }
    async handleRecordingCompleted(data) {
        var _a;
        if (data.event === 'endpoint.url_validation') {
            return this.urlValidate(data);
        }
        const recordings = data.payload.object.recordings;
        const payloadObject = recordings[0];
        const contactInfo = this.getContactInfo(payloadObject);
        const downloadUrls = this.getDownloadUrls(recordings);
        if (((_a = contactInfo === null || contactInfo === void 0 ? void 0 : contactInfo.number) === null || _a === void 0 ? void 0 : _a.length) > 3) {
            this.logger.log({
                payload: {
                    payloadObject,
                    contactInfo,
                    downloadUrls,
                    usageDate: luxon_1.DateTime.now(),
                    method: 'handleRecordingCompleted',
                    message: 'Zoom Call Recording Payload',
                },
            }, contexts_1.CONTEXT_ZOOM_CALL_RECORDING);
            const hubspotContact = await this.hubspotService.getContactByPhoneNumber(contactInfo.number);
            this.logger.log({
                payload: {
                    hubspotContact,
                    usageDate: luxon_1.DateTime.now(),
                    method: 'handleRecordingCompleted',
                    message: 'Zoom Call Find HubSpot Contact using number',
                },
            }, contexts_1.CONTEXT_ZOOM_CALL_RECORDING);
            let hubspotContactId = ((0, lodash_1.get)(hubspotContact, ['body', 'results', '0', 'id'], null));
            this.logger.log({
                payload: {
                    hubspotContactId,
                    usageDate: luxon_1.DateTime.now(),
                    method: 'handleRecordingCompleted',
                    message: 'HubSpot Contact ID',
                },
            }, contexts_1.CONTEXT_ZOOM_CALL_RECORDING);
            if (!hubspotContactId) {
                const createdHubspotContact = await this.hubspotService.createContact(contactInfo.number, contactInfo.name);
                hubspotContactId = createdHubspotContact.body.id;
                this.logger.log({
                    payload: {
                        createdHubspotContact,
                        usageDate: luxon_1.DateTime.now(),
                        method: 'handleRecordingCompleted',
                        message: 'HubSpot contact created',
                    },
                }, contexts_1.CONTEXT_ZOOM_CALL_RECORDING);
            }
            const zoomUserId = await this.getZoomUserId(payloadObject);
            const zoomUser = await this.getUser(zoomUserId);
            const zoomUserEmail = (0, lodash_1.get)(zoomUser, ['email']);
            const hsOwnerId = await this.hubspotService.getOwnerByEmail(zoomUserEmail);
            this.logger.log({
                payload: {
                    zoomUserId,
                    zoomUser,
                    zoomUserEmail,
                    hsOwnerId,
                    usageDate: luxon_1.DateTime.now(),
                    method: 'handleRecordingCompleted',
                    message: 'Zoom User Info & HubSpot Contact ID',
                },
            }, contexts_1.CONTEXT_ZOOM_CALL_RECORDING);
            const calls = downloadUrls.map((url) => {
                return this.hubspotService.createCallEngagement(hubspotContactId, url, payloadObject, hsOwnerId);
            });
            return await Promise.all(calls);
        }
        this.logger.log({
            payload: {
                contactInfo,
                usageDate: luxon_1.DateTime.now(),
                method: 'handleRecordingCompleted',
                message: 'Caller Number is Null OR having 3 digits',
            },
        });
        return null;
    }
    deleteAllS3Object(bucketName, keyData) {
        return this.s3Service.deleteS3Object(bucketName, keyData);
    }
    deleteRecords(idsDelete) {
        return this.zoomDsRepository.deleteManyRecords(idsDelete);
    }
    async getZoomUserId(payload) {
        const { type, id } = (0, lodash_1.get)(payload, ['owner']);
        const callId = (0, lodash_1.get)(payload, ['call_id']);
        if (type === 'user') {
            return id;
        }
        const { log_details: logs } = await this.getCallLog(callId);
        const log = (0, lodash_1.find)(logs, (log) => {
            const result = (0, lodash_1.get)(log, ['result'], '');
            const type = (0, lodash_1.get)(log, ['forward_to', 'type']);
            return result === 'Call connected' && type === 'user';
        });
        if (!log) {
            throw new common_1.HttpException({
                message: `Couldnt find the zoom user id for call ID number: ${callId}`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        return (0, lodash_1.get)(log, ['forward_to', 'id']);
    }
    getRecordingAudioUrl(id) {
        return `${this.reverseProxyUrl}${id}`;
    }
    getContactInfo({ caller_number, callee_number, callee_name, caller_name, direction, }) {
        switch (direction) {
            case 'outbound':
                return { number: callee_number, name: callee_name };
            case 'inbound':
                return { number: caller_number, name: caller_name };
            default:
                break;
        }
    }
    async getCallLog(id) {
        const { access_token } = await this.getAuthToken();
        const url = `/v2/phone/call_logs/${id}`;
        const request = this.httpService.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const response = await (0, rxjs_1.firstValueFrom)(request);
        return (0, lodash_1.get)(response, ['data']);
    }
    async downloadCall(id) {
        const response = await this.getCallLogById(id);
        return response.file_url;
    }
    async getCallLogById(id) {
        const { access_token } = await this.getAuthToken();
        const url = `phone/call_logs/${id}/recordings`;
        try {
            const request = await this.http.get(url, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return request.data;
        }
        catch (error) {
            if (error instanceof axios_2.AxiosError) {
                throw new common_1.HttpException({
                    message: 'Error while retrieveing call log data records',
                    method: 'getCallLogById',
                    error: error.message,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getCallLogByEmail(id, from, to, nextPageToken, page, perPage) {
        const { access_token } = await this.getAuthToken();
        const urlParams = {
            from: from,
            to: to,
            page_size: perPage.toString(),
        };
        if (nextPageToken !== 'first') {
            urlParams.next_page_token = nextPageToken;
        }
        const params = (0, url_1.paramsStringify)(urlParams);
        const url = `phone/users/${id}/call_logs?` + params;
        try {
            const request = await this.http.get(url, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return request.data;
        }
        catch (error) {
            if (error instanceof axios_2.AxiosError) {
                throw new common_1.HttpException({
                    message: 'Error while retrieveing call recording by ID',
                    method: 'getCallLogByEmail',
                    error: error.message,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getUser(id) {
        const { access_token } = await this.getAuthToken();
        const url = `/v2/users/${id}`;
        const request = this.httpService.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const response = await (0, rxjs_1.firstValueFrom)(request);
        return (0, lodash_1.get)(response, ['data']);
    }
    async getAuthToken() {
        const headersRequest = {
            Authorization: `Basic ${this.basicToken}`,
        };
        const url = this.zoomServerOAuthUrl;
        const request = this.httpService.post(url, {}, { headers: headersRequest });
        const response = await (0, rxjs_1.firstValueFrom)(request);
        return (0, lodash_1.get)(response, ['data']);
    }
    urlValidate(payload) {
        const plainToken = payload.payload.plainToken;
        const hashForValidate = (0, crypto_1.createHmac)('sha256', this.zoomSecretToken)
            .update(plainToken)
            .digest('hex');
        const response = {
            plainToken: plainToken,
            encryptedToken: hashForValidate,
        };
        return response;
    }
    getDownloadUrls(recordings) {
        return recordings.map((record) => {
            return this.buildDownloadUrl(record.download_url);
        });
    }
    buildDownloadUrl(zoomUrl) {
        const domain = this.integrationServicesUrl;
        const audioId = zoomUrl.split('download/')[1];
        const path = `${this.phoneRecordingPath}${audioId}`;
        const url = new URL(path, domain);
        return url.href;
    }
    async handleZoomRecordingCompleted(data) {
        const customerName = this.getCustomerName(data.topic);
        const filter = {
            hostEmail: data.host_email,
            zoomMeetinguuid: data.uuid,
        };
        const result = await this.zoomDsRepository.first(filter);
        if (result) {
            throw new common_1.HttpException({ message: 'This record already exists' }, common_1.HttpStatus.OK);
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
    async zoomMemberRecordAdd(zoomRecData) {
        return this.zoomMemberRepository.store(zoomRecData);
    }
    async zoomPhoneUserAdd(zoomRecData) {
        return this.zoomPhoneUserRepository.store(zoomRecData);
    }
    async zoomMemberRecordUpdate(zoomRecData) {
        return this.zoomMemberRepository.update(zoomRecData.id, zoomRecData);
    }
    async zoomMemberRecordDelete(id) {
        return this.zoomMemberRepository.delete(id);
    }
    async getZoomVideoForDelete() {
        const lastDay = luxon_1.DateTime.now().minus({ days: 90 }).toISO();
        const filter = {
            createdAt: { $lte: lastDay },
            deletedAt: null,
        };
        return this.zoomDsRepository.findAll(filter);
    }
    async getZoomCloudVideoForDelete() {
        const lastDay = luxon_1.DateTime.now().minus({ days: 30 }).toISO();
        const filter = {
            createdAt: { $lte: lastDay },
            zoomCloudDeletedAt: null,
        };
        return this.zoomDsRepository.findAll(filter);
    }
    async deleteRecordingInZoom(meetingUuid, id) {
        const zoomToken = this.generateZoomToken();
        const url = `meetings/${meetingUuid}/recordings?action=delete`;
        try {
            const headersRequest = {
                Authorization: `Bearer ${zoomToken}`,
            };
            const response = await this.http.delete(url, {
                headers: headersRequest,
            });
            const zoomRecData = {
                zoomCloudDeletedAt: luxon_1.DateTime.now(),
            };
            await this.zoomDsRepository.update(id, zoomRecData);
            return response;
        }
        catch (error) {
            if (error instanceof axios_2.AxiosError) {
                const payload = {
                    usageDate: luxon_1.DateTime.now(),
                    error: error.message,
                    message: error.message,
                };
                this.logger.error({ payload }, '', contexts_1.CONTEXT_ZOOM_CLOUD_MEETING_DELETE);
            }
        }
    }
    generateZoomToken() {
        const zoomPayload = {
            iss: this.apiKey,
            exp: new Date().getTime() + 10000,
        };
        return jsonwebtoken_1.default.sign(zoomPayload, this.apiSecret);
    }
    getCustomerName(topic) {
        return topic.split(',')[0];
    }
    async screenRecordingGetRecords(email, page, perPage, { topic, endDate, startDate }) {
        const filter = {
            hostEmail: { $eq: email },
        };
        if (topic) {
            filter.topic = new RegExp(`${topic}`, 'i');
        }
        if (startDate && endDate) {
            filter.createdAt = {
                $gte: luxon_1.DateTime.fromISO(startDate).startOf('day'),
                $lte: luxon_1.DateTime.fromISO(endDate).endOf('day'),
            };
        }
        const options = {
            skip: page * perPage,
            limit: perPage,
            lean: true,
            sort: { createdAt: -1 },
        };
        return this.zoomDsRepository.findAllPaginated(filter, options);
    }
    async zoomMemberGetRecords(email) {
        return this.zoomMemberRepository.findByEmail(email);
    }
    async screenRecordingPlayVideo(id) {
        const zoomRecord = await this.zoomDsRepository.findById(id);
        if (!zoomRecord) {
            throw new common_1.HttpException({ message: 'Zoom Record not found' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const { bucketName, keyName } = zoomRecord;
        const response = {
            message: 'URL sent successfully',
            preSignedUrl: this.s3Service.preSignedDownload(bucketName, keyName),
        };
        return response;
    }
    async phoneCallZoomUser(email) {
        const coachRecord = await this.zoomPhoneUserRepository.getUniqueHostMail(email);
        if (!coachRecord) {
            throw new common_1.HttpException({ message: 'Team Members List not found' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const response = {
            message: 'Team Members successfully sent',
            coachEmailList: coachRecord,
        };
        return response;
    }
    async getCallLogs(email, page, perPage, { endDate, startDate }, nextPageToken) {
        const to = endDate || luxon_1.DateTime.now().toISODate();
        const from = startDate || luxon_1.DateTime.now().minus({ days: 30 }).toISODate();
        const request = await this.getCallLogByEmail(email, from, to, nextPageToken, page, perPage);
        return paginator_1.PaginatorSchema.buildResult(request.total_records, request, page, perPage);
    }
    async getCoachesList(email) {
        const coachRecord = await this.zoomDsRepository.getUniqueHostMail(email);
        if (!coachRecord) {
            throw new common_1.HttpException({ message: 'DentistCoach List Record not found' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const response = {
            message: 'DentistCoach list successfully sent',
            coachEmailList: coachRecord,
        };
        return response;
    }
    getAllMemberRecords(page, perPage) {
        const options = {
            skip: page * perPage,
            limit: perPage,
            lean: true,
            sort: { createdAt: -1 },
        };
        return this.zoomMemberRepository.findAllPaginated({}, options);
    }
};
ZoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('INTEGRATION_SERVICES_URL')),
    __param(1, (0, common_1.Inject)(constants_1.ZOOMAPI_PROVIDER_NAME)),
    __param(2, (0, common_1.Inject)('ZOOM_SERVER_O_URL')),
    __param(3, (0, common_1.Inject)('ZOOM_BASIC_TOKEN')),
    __param(4, (0, common_1.Inject)('ZOOM_SECRET_TOKEN')),
    __param(5, (0, common_1.Inject)(constants_1.ZOOM_API_KEY)),
    __param(6, (0, common_1.Inject)(constants_1.ZOOM_SECRET_KEY)),
    __param(9, (0, common_1.Inject)('REVERSE_PROXY_URL')),
    __metadata("design:paramtypes", [Object, axios_2.Axios, String, String, String, String, String, hubspot_service_1.HubspotService,
        s3_service_1.S3Service, String, zoom_repository_1.ZoomDsRepository,
        zoom_member_repository_1.ZoomMemberRepository,
        zoom_phone_user_repository_1.ZoomPhoneUserRepository,
        axios_1.HttpService,
        common_1.Logger])
], ZoomService);
exports.ZoomService = ZoomService;
//# sourceMappingURL=zoom.service.js.map