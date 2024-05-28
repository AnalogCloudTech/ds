import tracer from 'dd-trace';
import 'dotenv/config';

tracer.init({
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

export default tracer;
