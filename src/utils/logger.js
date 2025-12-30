/**
 * @typedef {'log' | 'info' | 'warn' | 'error'} LogLevel
 */

/**
 * @typedef {Object} LogStyle
 * @property {string} [bg]     - 背景色
 * @property {string} [color]  - 文字颜色
 */

/**
 * 浏览器彩色日志 Logger
 * - DEV 环境启用
 * - PROD 默认禁用（error 可选保留）
 */
class Logger {
  /**
   * @param {Object} [options]
   * @param {boolean} [options.keepError=true] - 生产环境是否保留 error
   * @param {boolean} [options.enable=true]    - 是否启用 logger
   */
  constructor(options = {}) {
    /** @type {boolean} */
    this.isDev = typeof import.meta !== 'undefined' ? import.meta.env?.DEV : true;

    /** @type {boolean} */
    this.enable = this.isDev && options.enable !== false;

    /** @type {boolean} */
    this.keepError = options.keepError !== false;

    /** @type {LogStyle} */
    this.defaultStyle = {
      bg: '#409eff',
      color: '#fff'
    };
  }

  /**
   * 统一格式化 message（解决 unknown / Error / object）
   * @private
   * @param {unknown} message
   * @returns {string}
   */
  _formatMessage(message) {
    if (typeof message === 'string') {
      return message;
    }

    if (message instanceof Error) {
      return message.stack || message.message;
    }

    if (message === undefined) {
      return 'undefined';
    }

    try {
      return JSON.stringify(message, null, 2);
    } catch {
      return String(message);
    }
  }

  /**
   * @private
   * @param {LogLevel} level
   * @param {string} label
   * @param {unknown} message
   * @param {LogStyle} [style]
   */
  _print(level, label, message, style = {}) {
    if (!this.enable && !(this.keepError && level === 'error')) {
      return;
    }

    const { bg, color } = {
      ...this.defaultStyle,
      ...style
    };

    const text = this._formatMessage(message);

    console[level](
      `%c ${label} %c ${text}`,
      `
        background:${bg};
        color:${color};
        padding:2px 6px;
        border-radius:4px;
        font-weight:600;
      `,
      `color:${bg};`
    );
  }

  /**
   * @param {string} label
   * @param {unknown} msg
   * @param {LogStyle} [style]
   */
  log(label, msg, style) {
    this._print('log', label, msg, style);
  }

  /**
   * @param {string} label
   * @param {unknown} msg
   * @param {LogStyle} [style]
   */
  info(label, msg, style) {
    this._print('info', label, msg, style);
  }

  /**
   * @param {string} label
   * @param {unknown} msg
   * @param {LogStyle} [style]
   */
  warn(label, msg, style = { bg: '#ff0', color: '#fff' }) {
    this._print('warn', label, msg, style);
  }

  /**
   * @param {unknown} label
   * @param {unknown} msg
   * @param {LogStyle} [style]
   */
  error(label, msg, style = { bg: '#f00', color: '#fff' }) {
    this._print('error', label, msg, style);
  }
}

export default Logger;
