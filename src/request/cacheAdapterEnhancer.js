import { buildSortedURL, isCacheLike } from './utils';
import axios from 'axios';

const DefaultOptions = {
  enabledByDefault: false,
  cacheFlag: 'cache',
  threshold: 40
};

export const CacheAdapterEnhancer = (adapter, CACHE, options = DefaultOptions) => {
  const { enabledByDefault, cacheFlag } = options;
  return (config) => {
    const { url, method, params, paramsSerializer, forceUpdate } = config;
    const useCache =
      config[cacheFlag] !== void 0 && config[cacheFlag] !== null
        ? config[cacheFlag]
        : enabledByDefault;
    if (method === 'get' && useCache) {
      // if had provided a specified cache, then use it instead
      const cache = isCacheLike(useCache) ? useCache : CACHE;

      // build the index according to the url and params
      const index = buildSortedURL(url, params, paramsSerializer);

      let responsePromise = cache.get(index);
      if (!responsePromise || forceUpdate) {
        responsePromise = (async () => {
          try {
            return await axios.getAdapter(adapter)(config);
          } catch (reason) {
            'delete' in cache ? cache.delete(index) : cache.del(index);
            throw reason;
          }
        })();

        // put the promise for the non-transformed response into cache as a placeholder
        cache.set(index, responsePromise);
      }

      return responsePromise;
    }
    return axios.getAdapter(adapter)(config);
  };
};
