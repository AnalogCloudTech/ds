"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFirstLetter = void 0;
function capitalizeFirstLetter(text) {
    const lower = text.toLowerCase();
    const firstLetter = text.charAt(0).toUpperCase();
    return `${firstLetter}${lower.slice(1)}`;
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
//# sourceMappingURL=index.js.map