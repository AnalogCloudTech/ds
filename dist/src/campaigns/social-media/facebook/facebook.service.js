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
exports.FacebookService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const fb_1 = require("fb");
const mongoose_2 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
let FacebookService = class FacebookService {
    constructor(facebookModel, configService) {
        this.facebookModel = facebookModel;
        this.configService = configService;
    }
    async create(createFacebookDto) {
        (0, fb_1.setAccessToken)(this.configService.get('socialMedia.facebook.token'));
        const response = await (0, fb_1.api)(`/${this.configService.get('socialMedia.facebook.developerId')}/photos`, 'POST', {
            url: createFacebookDto.photo,
            message: createFacebookDto.message,
        });
        if (response.error) {
            return response.error;
        }
        const savedFbPost = new this.facebookModel(createFacebookDto);
        return savedFbPost.save();
    }
};
FacebookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Facebook')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        config_1.ConfigService])
], FacebookService);
exports.FacebookService = FacebookService;
//# sourceMappingURL=facebook.service.js.map