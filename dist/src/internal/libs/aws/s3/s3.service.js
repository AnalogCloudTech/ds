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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const constants_1 = require("./constants");
const uuid_1 = require("uuid");
const stream_1 = require("stream");
const csv = require("fast-csv");
let S3Service = class S3Service {
    constructor(s3) {
        this.s3 = s3;
    }
    preSignedDownload(bucketName, key, expiration = constants_1.FIFTEEN_MINUTES_IN_SECONDS) {
        return this.s3.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: key,
            Expires: expiration,
        });
    }
    preSignedUpload({ bucket, path, ext, contentType, expiration = constants_1.FIFTEEN_MINUTES_IN_SECONDS, }) {
        const fullPath = this.sanitizePath(path, ext);
        return this.s3.getSignedUrl('putObject', {
            Bucket: bucket,
            Key: fullPath,
            Expires: expiration,
            ContentType: contentType,
        });
    }
    async uploadStream({ bucket, fullPath, contentType, stream, }) {
        const uploadParams = {
            Bucket: bucket,
            Key: fullPath,
            ContentType: contentType,
            Body: stream,
        };
        const response = await this.s3.upload(uploadParams).promise();
        return response.Location;
    }
    async uploadCsv(path, data, bucket) {
        const csvStream = this.createCsvStream(data);
        const fullPath = this.sanitizePath(path, 'csv');
        await this.uploadStream({
            bucket,
            fullPath,
            contentType: 'text/csv',
            stream: csvStream,
        });
        return this.preSignedDownload(bucket, fullPath);
    }
    createCsvStream(data) {
        const csvStream = new stream_1.PassThrough();
        csv.writeToStream(csvStream, data, {
            headers: true,
            delimiter: ',',
            quote: '"',
            escape: '"',
            includeEndRowDelimiter: true,
        });
        return csvStream;
    }
    preSignedUploadWithCustomer(_a) {
        var { path, customer } = _a, rest = __rest(_a, ["path", "customer"]);
        const newPath = `${customer._id.toString()}/${path}`;
        return this.preSignedUpload(Object.assign({ path: newPath }, rest));
    }
    sanitizePath(path, ext) {
        const key = (0, uuid_1.v4)();
        let fullPath = [];
        if (path) {
            fullPath = path.split('/');
        }
        if (!key) {
            throw new common_1.HttpException({ message: 'missing file key' }, common_1.HttpStatus.BAD_REQUEST);
        }
        fullPath.push(`${key}.${ext}`);
        return fullPath.join('/');
    }
    async deleteS3Object(bucketName, keyData) {
        const params = {
            Bucket: bucketName,
            Delete: { Objects: keyData, Quiet: false }
        };
        return this.s3.deleteObjects(params).promise();
    }
};
S3Service = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.S3ProviderName)),
    __metadata("design:paramtypes", [aws_sdk_1.S3])
], S3Service);
exports.S3Service = S3Service;
//# sourceMappingURL=s3.service.js.map