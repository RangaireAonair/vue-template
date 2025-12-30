// vite-plugin-csp-nonce.js
import { createHash } from 'node:crypto';

export default function vitePluginCspNonce() {
  let isDev = false;
  let nonce = '';

  return {
    name: 'vite-plugin-csp-nonce',
    // 1. 在 config 钩子中判断环境
    config(config, { command }) {
      isDev = command === 'serve';
      nonce = createHash('sha256').update(Date.now().toString()).digest('hex');
    },

    // 2. 在 transformIndexHtml 钩子中注入 CSP 和 nonce
    transformIndexHtml(html) {
      const cspPolicy = [
        `default-src 'self'`,
        `script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : `'nonce-${nonce}'`}`, // 开发环境允许 eval
        `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
        `connect-src 'self' ${isDev ? 'https://jsonplaceholder.typicode.com' : 'http://localhost:9527'}`,
        `img-src 'self' https://api.dicebear.com`,
        `child-src https://www.baidu.com`
      ].join('; ');

      // 注入 CSP meta 标签和 nonce 到 script/style
      return html
        .replace(
          /<head>/,
          `<head>\n<meta http-equiv="Content-Security-Policy" content="${cspPolicy}">`
        )
        .replace(/<script(.*?)>/g, `<script nonce="${nonce}"$1>`)
        .replace(/<style(.*?)>/g, `<style nonce="${nonce}"$1>`);
    }
  };
}
