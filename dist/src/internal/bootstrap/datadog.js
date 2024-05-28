"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dd_trace_1 = require("dd-trace");
require("dotenv/config");
dd_trace_1.default.init({
    service: 'digital-services',
    hostname: process.env.DD_AGENT_HOST,
    port: 8126,
    env: process.env.DD_ENV_PREFIX,
    version: process.env.DD_VERSION,
    sampleRate: 1,
    logInjection: true,
    profiling: true,
    runtimeMetrics: true,
});
exports.default = dd_trace_1.default;
//# sourceMappingURL=datadog.js.map