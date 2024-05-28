"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsServiceMock = void 0;
const data_mocked_1 = require("./data.mocked");
class CmsServiceMock {
    magazineDetails(magazineId) {
        return data_mocked_1.cmsMagazineResponseMock;
    }
    magazineData(month, year) {
        return [data_mocked_1.cmsMagazineResponseMock];
    }
}
exports.CmsServiceMock = CmsServiceMock;
//# sourceMappingURL=cms.service.mock.js.map