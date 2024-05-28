"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeInterceptor = exports.Serialize = exports.resolverSerializer = exports.ExposeId = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const class_transformer_1 = require("class-transformer");
function ExposeId() {
    return (0, class_transformer_1.Transform)(({ key, obj }) => {
        var _a;
        if (key === 'id') {
            key = '_id';
        }
        return ((_a = obj[key]) === null || _a === void 0 ? void 0 : _a._id) || obj[key];
    }, {
        toClassOnly: true,
    });
}
exports.ExposeId = ExposeId;
function resolverSerializer(Domain, rawData) {
    try {
        const data = rawData.data || rawData;
        const castedData = data.length
            ? data.map((d) => (0, class_transformer_1.plainToInstance)(Domain, d, {
                excludeExtraneousValues: true,
            }))
            : (0, class_transformer_1.plainToInstance)(Domain, data, {
                excludeExtraneousValues: true,
            });
        if (Array.isArray(rawData.data)) {
            return Object.assign(Object.assign({}, rawData), { data: castedData });
        }
        return castedData;
    }
    catch (err) {
        throw new Error('error in object serialization');
    }
}
exports.resolverSerializer = resolverSerializer;
function Serialize(domain) {
    return (0, common_1.UseInterceptors)(new SerializeInterceptor(domain));
}
exports.Serialize = Serialize;
class SerializeInterceptor {
    constructor(domain) {
        this.domain = domain;
    }
    intercept(_context, next) {
        return next
            .handle()
            .pipe((0, operators_1.map)((rawData) => resolverSerializer(this.domain, rawData)));
    }
}
exports.SerializeInterceptor = SerializeInterceptor;
//# sourceMappingURL=serialize.interceptor.js.map