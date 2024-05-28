"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const opentelemetry = require("@opentelemetry/sdk-node");
const api_1 = require("@opentelemetry/api");
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const resources_1 = require("@opentelemetry/resources");
const OTLP_URL = process.env.OTLP_URL;
if (OTLP_URL) {
    if (process.env.OTLP_DEBUG === 'true') {
        api_1.diag.setLogger(new api_1.DiagConsoleLogger(), api_1.DiagLogLevel.DEBUG);
    }
    const exporter = new exporter_trace_otlp_grpc_1.OTLPTraceExporter({
        url: OTLP_URL,
    });
    const sdk = new opentelemetry.NodeSDK({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: process.env.OTLP_SERVICE_NAME,
        }),
        instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
        traceExporter: exporter,
    });
    sdk
        .start()
        .then(() => {
        console.log('finished to initialize OpenTelemetry');
    })
        .catch((err) => {
        console.error('error initializing tracing', err);
    });
    process.on('SIGTERM', () => {
        sdk
            .shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
}
//# sourceMappingURL=opentelemetry.js.map