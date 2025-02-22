"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediaModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const facebook_module_1 = require("./facebook/facebook.module");
const templates_module_1 = require("./templates/templates.module");
const campaings_module_1 = require("./campaings/campaings.module");
const attributes_module_1 = require("./attributes/attributes.module");
const contents_module_1 = require("./contents/contents.module");
let SocialMediaModule = class SocialMediaModule {
};
SocialMediaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            facebook_module_1.FacebookModule,
            axios_1.HttpModule,
            templates_module_1.TemplatesModule,
            campaings_module_1.CampaingsModule,
            attributes_module_1.AttributesModule,
            contents_module_1.ContentsModule,
        ],
    })
], SocialMediaModule);
exports.SocialMediaModule = SocialMediaModule;
//# sourceMappingURL=social-media.module.js.map