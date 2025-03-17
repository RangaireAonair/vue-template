import axios from 'axios';
export { LRUCache } from 'lru-cache';
export function buildSortedURL(...args) {
  const [url, params, paramsSerializer] = args;
  const builtURL = axios.getUri({ url, params, paramsSerializer });

  const [urlPath, queryString] = builtURL.split('?');

  if (queryString) {
    const paramsPair = queryString.split('&');
    return `${urlPath}?${paramsPair.sort().join('&')}`;
  }

  return builtURL;
}
export function isCacheLike(cache) {
  return (
    typeof cache.get === 'function' &&
    typeof cache.set === 'function' &&
    (typeof cache.delete === 'function' || typeof cache.del === 'function')
  );
}

const notEmpty = (key) => ![null, void 0].includes(key);

export function ParserResponse(response) {
  const { data = null, code } = JSON.parse(response);
  if (code === 1 && notEmpty(data)) return data;
  return null;
}
