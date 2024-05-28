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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomS3Scheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const dateFormatters_1 = require("../common/utils/dateFormatters");
const zoom_service_1 = require("./zoom.service");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../../internal/common/contexts");
let ZoomS3Scheduler = class ZoomS3Scheduler {
    constructor(zoomService, logger) {
        this.zoomService = zoomService;
        this.logger = logger;
    }
    async handleZoomS3Scheduler() {
        const recordData = await this.zoomService.getZoomVideoForDelete();
        if (recordData.length) {
            const bucketName = recordData[0].bucketName;
            const keyData = recordData.map((item) => {
                return {
                    Key: item.keyName,
                };
            });
            try {
                await this.zoomService.deleteAllS3Object(bucketName, keyData);
                const idsDelete = recordData.map((item) => item._id);
                await this.zoomService.deleteRecords(idsDelete);
            }
            catch (error) {
                if (error instanceof Error) {
                    const payload = {
                        usageDate: luxon_1.DateTime.now(),
                        error: error === null || error === void 0 ? void 0 : error.message,
                        stack: error === null || error === void 0 ? void 0 : error.stack,
                        message: `Unable to delete the objects in AWS S3 `,
                    };
                    this.logger.error({ payload }, '', contexts_1.CONTEXT_ZOOM_MEETING_DELETE);
                }
            }
        }
        const payload = {
            usageDate: luxon_1.DateTime.now(),
            error: 'There is no records found',
            message: `There is no records found`,
        };
        this.logger.error({ payload }, '', contexts_1.CONTEXT_ZOOM_MEETING_DELETE);
    }
    async ZoomCloudScheduler() {
        const recordData = await this.zoomService.getZoomCloudVideoForDelete();
        if (recordData.length) {
            await Promise.all(recordData.map((item) => {
                const { zoomMeetinguuid, _id } = item;
                return this.zoomService.deleteRecordingInZoom(zoomMeetinguuid, _id);
            }));
        }
        const payload = {
            usageDate: luxon_1.DateTime.now(),
            error: 'There is no records found',
            message: `There is no records found`,
        };
        this.logger.error({ payload }, '', contexts_1.CONTEXT_ZOOM_CLOUD_MEETING_DELETE);
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        name: 'ZoomScheduler',
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZoomS3Scheduler.prototype, "handleZoomS3Scheduler", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        name: 'ZoomCloudScheduler',
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZoomS3Scheduler.prototype, "ZoomCloudScheduler", null);
ZoomS3Scheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [zoom_service_1.ZoomService, common_1.Logger])
], ZoomS3Scheduler);
exports.ZoomS3Scheduler = ZoomS3Scheduler;
//# sourceMappingURL=zoom-s3.schedulers.js.map