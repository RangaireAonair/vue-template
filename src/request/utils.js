import axios from 'axios';
import { logger } from '@/utils/logHub.js';
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

/**
 * 归一化校验函数
 * @param {Function|Object|undefined} validator
 * @returns {(payload: any) => boolean}
 */
export function createValidator(validator) {
  // 1️⃣ function validator
  if (typeof validator === 'function') {
    return validator;
  }

  // 2️⃣ object validator（且必须有规则）
  if (validator && typeof validator === 'object' && Object.keys(validator).length > 0) {
    return (payload) => Object.keys(validator).every((key) => payload[key] === validator[key]);
  }

  // 3️⃣ 空对象 / 未传 → 永远通过
  return () => true;
}

function normalizeResponseShape(raw) {
  if (!raw || typeof raw !== 'object' || raw instanceof Blob || raw instanceof ArrayBuffer) {
    return raw;
  }

  return 'data' in raw ? raw.data : raw;
}

/**
 * @typedef {Object} ResponsePayload
 * @property {any} raw
 * @property {any} data
 * @property {number|null} code
 */

/**
 * 接口地址信息
 * @typedef {Object} ApiInfoType
 * @property {string} [baseURL] 默认基地址
 * @property {string} [url] api路径
 */

/**
 * 归一化校验函数
 * @param {Object | null | Blob | ArrayBuffer} [response]
 * @param {ApiInfoType} [apiInfo]
 * @param {(payload: ResponsePayload) => boolean | Object} [validator]
 * @param {(payload: ResponsePayload) => any } [applyTransform]
 * @returns {(payload: any) => boolean}
 */
export function ParserResponse(response, apiInfo, validator, applyTransform) {
  const data = normalizeResponseShape(response);

  const payload = {
    raw: response, // 原始响应（完整）
    data, // 规范化后的数据
    code: response?.code ?? 1
  };

  const validate = createValidator(validator);

  if (!validate(payload)) {
    return null;
  }

  if (typeof applyTransform === 'function') {
    try {
      return applyTransform(payload);
    } catch (e) {
      const { baseURL, url } = apiInfo;
      logger.error(`${baseURL}${url} response applyTransform error`, e.message);
      return null;
    }
  }

  return payload.data;
}

export function transformResponse(data, headers) {
  if (data == null || data === '') {
    return data;
  }

  // 2️⃣ 非字符串（blob / arraybuffer / object）直接返回
  if (typeof data !== 'string') {
    return data;
  }

  // 3️⃣ content-type 不是 json，直接返回
  const contentType = headers?.['content-type'] || '';
  if (!contentType.includes('application/json')) {
    return data;
  }

  // 4️⃣ 再尝试 parse
  try {
    return JSON.parse(data);
  } catch {
    // 解析失败，保留原始字符串（让上层决定）
    return data;
  }
}
