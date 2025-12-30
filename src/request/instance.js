import axios from 'axios';

import { useEnv } from '@/hooks/useEnv';
import { CacheAdapterEnhancer } from '@/request/cacheAdapterEnhancer';
import { LRUCache, transformResponse } from '@/request/utils.js';
import { setupInterceptors } from './interceptors.js';

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
  transformResponse: [transformResponse]
});

setupInterceptors(Instance);

export default Instance;
