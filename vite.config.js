import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { vitePlugins } from './src/plugins';

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [vue(), ...vitePlugins],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    extensions: ['.js', '.jsx']
  },
  css: {
    modules: {
      hashPrefix: 'module',
      generateScopedName(name, filename, css) {
        return `css-module-${name}`;
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        manualChunks(id) {
          if (id.includes('node_modules') && id.includes('element-plus')) {
            return 'element-plus';
          } else if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          } else {
            return 'vendor';
          }
        }
      },
      // external: ['Vue', 'element-plus', '@element-plus/icons-vue'],
      plugins: [
        // externalGlobals({
        //   vue: 'Vue',
        //   'element-plus': 'element-plus',
        //   ElementPlusIconsVue: '@element-plus/icons-vue'
        // })
      ]
    },
    minify: 'esbuild',
    sourceMap: false,
    reportCompressedSize: false,
    minifyCSS: true
  },
  esbuild: {
    drop: ['debugger', 'console']
  }
});
