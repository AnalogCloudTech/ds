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
exports.WebinarsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let WebinarsService = class WebinarsService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async getWebinar(webinarCode) {
        const webinarDto = {
            title: '',
            upcomingTimes: [''],
            timeZoneId: '',
        };
        try {
            const url = `webinars/${webinarCode}/registration-information`;
            const result = this.httpService.get(url);
            const { data } = await (0, rxjs_1.firstValueFrom)(result);
            webinarDto.title = data.title;
            webinarDto.upcomingTimes = data.upcoming_times;
            webinarDto.timeZoneId = data.timezone_id;
        }
        catch (error) {
            console.error(error);
        }
        return webinarDto;
    }
    async registerWebinar(webinarCode, registerWebinar) {
        let returnValue = '';
        try {
            const url = `webinars/${webinarCode}/registration`;
            const result = this.httpService.post(url, registerWebinar);
            const { data } = await (0, rxjs_1.firstValueFrom)(result);
            returnValue = `Successfully Registered for ${data.display_start_time}`;
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.HttpException(err.response.data, err.response.status);
            }
        }
        returnValue = 'Could not register.  Please try another time';
        return returnValue;
    }
};
WebinarsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], WebinarsService);
exports.WebinarsService = WebinarsService;
//# sourceMappingURL=webinars.service.js.map