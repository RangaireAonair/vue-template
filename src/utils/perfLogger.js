/**
 * @typedef {'log' | 'info' | 'warn' | 'error'} LogLevel
 */

/**
 * @typedef {Object} PerfThreshold
 * @property {number} fast   - 快速阈值（ms）
 * @property {number} normal - 普通阈值（ms）
 */
/**
 * @typedef {Object} LoggerLike
 * @property {boolean} enable
 * @property {(label: string, msg: string, style?: Object) => void} log
 * @property {(label: string, msg: string, style?: Object) => void} info
 * @property {(label: string, msg: string, style?: Object) => void} warn
 * @property {(label: string, msg: string, style?: Object) => void} error
 */
/**
 * 性能日志记录器
 * - 仅在开发环境启用
 * - 支持同步 / 异步耗时统计
 */
class PerfLogger {
  /**
   * @param {Logger} logger - Logger 实例
   * @param {Object} [options]
   * @param {number} [options.fast=100]   - fast 阈值（ms）
   * @param {number} [options.normal=500] - normal 阈值（ms）
   */
  constructor(logger, options = {}) {
    /** @type {boolean} */
    this.enable = logger?.enable ?? false;

    /** @type {PerfThreshold} */
    this.threshold = {
      fast: options.fast ?? 100,
      normal: options.normal ?? 500
    };

    /** @type {Map<string, number>} */
    this.tasks = new Map();

    /** @private */
    this.logger = logger;
  }

  /**
   * 开始记录一个性能任务
   * @param {string} key - 任务唯一标识
   */
  start(key) {
    if (!this.enable) return;
    this.tasks.set(key, performance.now());
  }

  /**
   * 结束性能任务并输出耗时
   * @param {string} key - 任务唯一标识
   * @param {string} [extra] - 额外描述信息
   */
  end(key, extra = '') {
    if (!this.enable) return;

    const start = this.tasks.get(key);
    if (!start) return;

    const cost = performance.now() - start;
    this.tasks.delete(key);

    const { bg, level } = this._resolveStyle(cost);

    this.logger[level]('PERF', `${key} ${cost.toFixed(2)}ms ${extra}`, { bg });
  }

  /**
   * 统计一个函数的执行耗时
   * 支持同步 / Promise
   *
   * @template T
   * @param {string} key - 任务名
   * @param {() => T | Promise<T>} fn - 被测函数
   * @returns {T | Promise<T>}
   */
  measure(key, fn) {
    if (!this.enable) return fn();

    this.start(key);
    const result = fn();

    if (result && typeof result.then === 'function') {
      return result.finally(() => this.end(key));
    }

    this.end(key);
    return result;
  }

  /**
   * 根据耗时计算样式和级别
   * @private
   * @param {number} cost - 耗时（ms）
   * @returns {{ bg: string, level: LogLevel }}
   */
  _resolveStyle(cost) {
    if (cost <= this.threshold.fast) {
      return { bg: '#67c23a', level: 'info' };
    }
    if (cost <= this.threshold.normal) {
      return { bg: '#e6a23c', level: 'warn' };
    }
    return { bg: '#f56c6c', level: 'error' };
  }
}

export default PerfLogger;
