import { logger, perfLogger, API_TAG } from '@/utils/logHub';
import { ParserResponse } from '@/request/utils.js';

/**
 * @param {import('axios').AxiosInstance} instance
 */
export function setupInterceptors(instance) {
  instance.interceptors.request.use(
    (config) => {
      const key = `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`;
      config.__perfKey = key;

      perfLogger.start(key);

      logger.info(API_TAG, `➡️ ${key}`, {
        bg: '#409eff'
      });
      config.headers['Authorization'] = '123';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      const key = response.config.__perfKey;

      perfLogger.end(key, `response.status (${response.status})`);

      logger.info(API_TAG, `✅ ${key}`, {
        bg: '#67c23a'
      });
      const {
        status,
        data,
        config: { validateStatus, baseURL, url, meta = {} }
      } = response;

      if (validateStatus(status)) {
        return ParserResponse(data, { baseURL, url }, meta?.validator, meta?.transform);
      } else {
        return Promise.reject(data);
      }
    },
    (error) => {
      const key = error.config?.__perfKey;

      if (key) {
        perfLogger.end(key, '(error)');
        logger.error(API_TAG, `❌ ${key}`, {
          bg: '#f56c6c'
        });
      }
      if (error.code === 'ERR_CANCELED') {
        return Promise.reject(new Error('current request has canceled'));
      }
      return Promise.reject(error.response);
    }
  );
}
