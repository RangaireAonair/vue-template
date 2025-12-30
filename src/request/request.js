import Instance from './instance.js';

const generateParams = (method = 'GET', params = {}) => {
  const methodType = method.toLowerCase();
  return ['get'].includes(methodType) ? { params: params } : { data: params };
};

const RequestMap = new WeakMap();

const generateRequestKey = (params) => ({ ...params });

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
