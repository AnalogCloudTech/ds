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
exports.ApiKeysService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const id128_1 = require("id128");
const api_key_schema_1 = require("./schemas/api-key.schema");
let ApiKeysService = class ApiKeysService {
    constructor(apiKeyModel) {
        this.apiKeyModel = apiKeyModel;
    }
    create(createApiKeyDto) {
        const key = id128_1.Uuid4.generate().toCanonical();
        const createdReleaseNote = new this.apiKeyModel(Object.assign(Object.assign({}, createApiKeyDto), { key }));
        return createdReleaseNote.save();
    }
    findOne(id) {
        return this.apiKeyModel.findById(id).exec();
    }
    findByKey(key) {
        return this.apiKeyModel.findOne({ key }).exec();
    }
    update(id, updateApiKeyDto) {
        return this.apiKeyModel
            .findByIdAndUpdate(id, updateApiKeyDto, {
            new: true,
        })
            .exec();
    }
    remove(id) {
        return this.apiKeyModel.findByIdAndDelete(id).exec();
    }
};
ApiKeysService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(api_key_schema_1.ApiKey.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ApiKeysService);
exports.ApiKeysService = ApiKeysService;
//# sourceMappingURL=api-keys.service.js.map