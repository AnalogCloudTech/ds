"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateSegmentsPipe = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
class ValidateSegmentsPipe {
    transform(dto) {
        if (dto.allSegments) {
            dto.segments = [];
        }
        const hasError = !dto.allSegments && !(0, lodash_1.get)(dto, ['segments', 'length']);
        if (hasError) {
            throw new common_1.BadRequestException([
                'If allSegments is equal to "false", segments cannot be empty',
            ]);
        }
        return dto;
    }
}
exports.ValidateSegmentsPipe = ValidateSegmentsPipe;
//# sourceMappingURL=validate-segments.pipe.js.map