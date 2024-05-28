import '@/internal/bootstrap/datadog';

import { AppBootstrap } from '@/internal/bootstrap/app';

(async () => {
  await AppBootstrap();
})();
