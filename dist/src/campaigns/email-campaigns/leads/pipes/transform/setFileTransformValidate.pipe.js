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
exports.SetFileTransformValidatePipe = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const lodash_1 = require("lodash");
const mime_types_1 = require("mime-types");
let SetFileTransformValidatePipe = class SetFileTransformValidatePipe {
    constructor(request) {
        this.request = request;
    }
    transform(dto) {
        dto.file = (0, lodash_1.get)(this.request, 'file');
        if (!dto.file) {
            throw new common_1.BadRequestException('file is Required');
        }
        const possibleExtensions = ['csv', 'xls', 'xlsx'];
        const possibleExtensionsString = possibleExtensions.join(', ');
        const fileExtension = (0, mime_types_1.extension)(dto.file.mimetype);
        const isValidExtension = possibleExtensions.includes(fileExtension);
        if (!isValidExtension) {
            throw new common_1.BadRequestException(`the file must be in ${possibleExtensionsString} type, ${fileExtension} provided`);
        }
        return dto;
    }
};
SetFileTransformValidatePipe = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object])
], SetFileTransformValidatePipe);
exports.SetFileTransformValidatePipe = SetFileTransformValidatePipe;
//# sourceMappingURL=setFileTransformValidate.pipe.js.map