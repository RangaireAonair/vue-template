import axios from 'axios';
import { useEnv } from '@/hooks/useEnv';
import qs from 'qs';
import { md5 } from 'js-md5';

const { VITE_BASE_API } = useEnv();
const Instance = axios.create({
  baseURL: VITE_BASE_API,
  timeout: 5000,
  headers: {
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  transformRequest: [(data) => JSON.stringify(data)],
  transformResponse: [
    function (response, headers, status, error) {
      if (status !== 200 && !headers['content-type'].startsWith('application/json')) {
        return null;
      }
      try {
        const { data = null, code } = JSON.parse(response);
        if (code === 1 && data) return data;
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
    return Promise.reject(err.response);
  }
);

const generateParams = (method = 'GET', params) => {
  const methodType = method.toUpperCase();
  return ['get'].includes(methodType) ? params : { data: params };
};

const RequestMap = new WeakMap();

const generateRequestKey = (params) => {
  return { ...params };
};

const request = (method = 'GET') => {
  let cancel;
  return (url, params, config = {}) =>
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
