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
exports.SnsService = void 0;
const common_1 = require("@nestjs/common");
const contants_1 = require("./contants");
const aws_sdk_1 = require("aws-sdk");
let SnsService = class SnsService {
    constructor(sns) {
        this.sns = sns;
    }
    async publish(message, topicName) {
        const topicArn = await this.getTopicArn(topicName);
        if (!topicArn) {
            throw new common_1.HttpException({ message: 'SNS topic not found' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return this.sns
            .publish({
            TopicArn: topicArn.TopicArn,
            Message: JSON.stringify(message),
        })
            .promise()
            .catch((err) => {
            if (err instanceof Error) {
                throw new common_1.HttpException({ message: err }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    async getTopicArn(topicName) {
        const topicList = await this.listAllTopics();
        return topicList.find((t) => {
            const arn = t.TopicArn.split(':');
            const name = arn[arn.length - 1];
            return name === topicName;
        });
    }
    async listAllTopics() {
        const topics = [];
        let next = null;
        do {
            const result = await this.sns.listTopics({ NextToken: next }).promise();
            next = result.NextToken;
            topics.push(...result.Topics);
        } while (next);
        return topics;
    }
};
SnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(contants_1.SnsProviderName)),
    __metadata("design:paramtypes", [aws_sdk_1.SNS])
], SnsService);
exports.SnsService = SnsService;
//# sourceMappingURL=sns.service.js.map