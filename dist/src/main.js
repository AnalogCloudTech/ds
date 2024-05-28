"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./internal/bootstrap/datadog");
const app_1 = require("./internal/bootstrap/app");
(async () => {
    await (0, app_1.AppBootstrap)();
})();
//# sourceMappingURL=main.js.map