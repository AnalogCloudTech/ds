"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePasswordConfirmationPipe = void 0;
const common_1 = require("@nestjs/common");
class ValidatePasswordConfirmationPipe {
    transform(dto) {
        if (dto.password !== dto.passwordConfirmation) {
            throw new common_1.BadRequestException([
                'Password and confirmation must have same value',
            ]);
        }
        return dto;
    }
}
exports.ValidatePasswordConfirmationPipe = ValidatePasswordConfirmationPipe;
//# sourceMappingURL=validate-password-confirmation.pipe.js.map