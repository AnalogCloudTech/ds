"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceTagsOnDemandEmails = exports.replaceTags = void 0;
function replaceTags(body, replacers) {
    return Object.keys(replacers).reduce((acc, idx) => {
        if (replacers[idx]) {
            const findRegex = new RegExp(idx, 'g');
            return acc.replace(findRegex, replacers[idx]);
        }
        return acc;
    }, body);
}
exports.replaceTags = replaceTags;
function replaceTagsOnDemandEmails(body, replacers) {
    return Object.keys(replacers).reduce((acc, idx) => {
        const findRegex = new RegExp(`{{${idx}}}`, 'g');
        return acc.replace(findRegex, replacers[idx]);
    }, body);
}
exports.replaceTagsOnDemandEmails = replaceTagsOnDemandEmails;
//# sourceMappingURL=replaceTags.js.map