"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookModule = void 0;
const common_1 = require("@nestjs/common");
const facebook_service_1 = require("./facebook.service");
const facebook_controller_1 = require("./facebook.controller");
const mongoose_1 = require("@nestjs/mongoose");
const facebook_schema_1 = require("./schemas/facebook.schema");
const axios_1 = require("@nestjs/axios");
let FacebookModule = class FacebookModule {
};
FacebookModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: facebook_schema_1.Facebook.name, schema: facebook_schema_1.FacebookSchema },
            ]),
            axios_1.HttpModule,
        ],
        controllers: [facebook_controller_1.FacebookController],
        providers: [facebook_service_1.FacebookService],
    })
], FacebookModule);
exports.FacebookModule = FacebookModule;
//# sourceMappingURL=facebook.module.js.map