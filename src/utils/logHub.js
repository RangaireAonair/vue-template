import Logger from '@/utils/logger.js';
import PerfLogger from '@/utils/perfLogger';

/** 日志实例 */
export const logger = new Logger({
  keepError: true,
  enable: true
});

/** 性能实例 */
export const perfLogger = new PerfLogger(logger, {
  fast: 120,
  normal: 600
});

export const API_TAG = 'API_TAG';
