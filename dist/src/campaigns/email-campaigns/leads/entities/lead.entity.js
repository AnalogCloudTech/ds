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
exports.LeadEntityList = exports.LeadEntity = void 0;
const lodash_1 = require("lodash");
const xlsx_1 = require("xlsx");
const mime_types_1 = require("mime-types");
const Papa = require("papaparse");
const stream_1 = require("stream");
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const types_1 = require("../domain/types");
const class_transformer_1 = require("class-transformer");
const files_1 = require("../utils/files");
class LeadEntity {
    constructor(params = {}) {
        this.fill(params);
        this.validator = new class_validator_1.Validator();
    }
    fill(params) {
        this.firstName = (0, lodash_1.get)(params, 'firstName');
        this.lastName = (0, lodash_1.get)(params, 'lastName');
        this.email = (0, lodash_1.get)(params, 'email');
        this.phone = (0, lodash_1.get)(params, 'phone');
        this.segments = (0, lodash_1.get)(params, 'segments');
        this.bookId = (0, lodash_1.get)(params, 'bookId');
        this.allSegments = (0, lodash_1.get)(params, 'allSegments') === 'true';
        this.isValid = (0, lodash_1.get)(params, 'isValid', true);
        this.unsubscribed = (0, lodash_1.get)(params, 'unsubscribed', false);
    }
    async validate() {
        return this.validator.validate(this);
    }
    set(property, value) {
        this[property] = value;
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadEntity.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadEntity.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LeadEntity.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeadEntity.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], LeadEntity.prototype, "segments", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LeadEntity.prototype, "allSegments", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LeadEntity.prototype, "customerEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LeadEntity.prototype, "bookId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LeadEntity.prototype, "isValid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LeadEntity.prototype, "unsubscribed", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], LeadEntity.prototype, "customer", void 0);
exports.LeadEntity = LeadEntity;
class LeadEntityList {
    constructor() {
        this.list = [];
    }
    setFile(file) {
        this.file = file;
    }
    push(lead) {
        this.list.push(lead);
    }
    async readFile() {
        try {
            const ext = (0, mime_types_1.extension)(this.file.mimetype);
            if (!ext) {
                throw new common_1.HttpException('Invalid file extension', common_1.HttpStatus.BAD_REQUEST);
            }
            const processor = types_1.Processors[ext];
            return await this[processor](this.file.buffer);
        }
        catch (e) {
            throw new common_1.HttpException('Error while processing file!', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    setAll(property, value) {
        this.list.forEach((lead) => lead.set(property, value));
    }
    async fillFromRawCsvFile(fileBuffer) {
        return new Promise((resolve, reject) => {
            const readStream = stream_1.Readable.from((0, files_1.detectEncodingAndCovertToString)(fileBuffer));
            const parsedData = [];
            Papa.parse(readStream, {
                step: (result) => {
                    parsedData.push(result.data);
                },
                complete: () => {
                    this.processCsvData(parsedData);
                    resolve(true);
                },
                error: () => {
                    reject(new common_1.HttpException('Invalid CSV file', common_1.HttpStatus.BAD_REQUEST));
                },
            });
        });
    }
    fillFromXLSFile(fileBuffer) {
        const { Sheets, SheetNames } = (0, xlsx_1.read)(fileBuffer);
        const csvData = xlsx_1.utils.sheet_to_csv(Sheets[(0, lodash_1.first)(SheetNames)]);
        const parsedData = Papa.parse(csvData);
        this.processCsvData(parsedData.data);
        return true;
    }
    processCsvData(payload) {
        payload
            .filter((row, key) => key > 0 && row.length > 0)
            .forEach((row) => {
            const [firstName, lastName, email, phone] = row;
            this.list.push(new LeadEntity({ firstName, lastName, email, phone }));
        });
    }
}
exports.LeadEntityList = LeadEntityList;
//# sourceMappingURL=lead.entity.js.map