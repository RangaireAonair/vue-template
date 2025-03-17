import axios from 'axios';
import { useEnv } from '@/hooks/useEnv';
import { CacheAdapterEnhancer } from '@/request/cacheAdapterEnhancer';
import { LRUCache, ParserResponse } from '@/request/utils.js';
const FIVE_MINUTES = 1000 * 60 * 5;
const CAPACITY = 100;
const CACHE = new LRUCache({ ttl: FIVE_MINUTES, max: CAPACITY });

const { VITE_BASE_API } = useEnv();
const Instance = axios.create({
  baseURL: VITE_BASE_API,
  timeout: 5000,
  headers: {
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  adapter: [CacheAdapterEnhancer(axios.defaults.adapter, CACHE)],
  transformRequest: [(data) => JSON.stringify(data)],
  transformResponse: [
    function (response, headers, status) {
      if (status !== 200) {
        return null;
      }
      try {
        return typeof response === 'string' ? ParserResponse(response) : response;
      } catch (e) {
        return null;
      }
    }
  ]
});

Instance.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = '123';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Instance.interceptors.response.use(
  (response) => {
    const {
      status,
      data,
      config: { validateStatus }
    } = response;
    if (validateStatus(status)) {
      return data;
    } else {
      return Promise.reject(data);
    }
  },
  (err) => {
    if (err.code === 'ERR_CANCELED') {
      return Promise.reject(new Error('current request has canceled'));
    }
    // console.error(err.message);
    return Promise.reject(err.response);
  }
);

const generateParams = (method = 'GET', params = {}) => {
  const methodType = method.toLowerCase();
  return ['get'].includes(methodType) ? { params: params } : { data: params };
};

const RequestMap = new WeakMap();

const generateRequestKey = (params) => {
  return { ...params };
};

const request = (method = 'GET') => {
  let cancel;
  return (url, params = {}, config = {}) =>
    new Promise((resolve) => {
      cancel && cancel.abort();
      cancel = new AbortController();
      const ApiKey = generateRequestKey({ method, params, url });
      if (!RequestMap.get(ApiKey)) {
        RequestMap.set(ApiKey, ApiKey);
      } else {
        RequestMap.delete(ApiKey);
        cancel.abort();
      }
      Instance({
        method,
        url,
        ...generateParams(method, params),
        ...config,
        signal: cancel.signal
      }).then(
        (response) => resolve([null, response]),
        (err) => resolve([err, null])
      );
    });
};

export const get = request();

export const post = request('POST');
