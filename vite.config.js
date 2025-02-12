import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import createZipPlugin from './src/plugins/zip.js';
import { createHtmlPlugin } from 'vite-plugin-html';
import viteCompression from 'vite-plugin-compression';
import externalGlobals from 'rollup-plugin-external-globals';
import miniImage from 'vite-plugin-minipic';
import { name } from './package.json';

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    vue(),
    createZipPlugin({ packageName: name }),
    viteCompression({
      /** 是否在控制控台打印被 压缩的文件信息 */
      verbose: false,
      /** 是否禁用压缩、默认为false */
      disable: false,
      /** 启用压缩的文件大小限制，单位是字节，默认为0 */
      threshold: 10240,
      ext: '.gz',
      algorithm: 'gzip',
      deleteOriginFile: true
    }),
    createHtmlPlugin({
      minify: false,
      entry: 'src/main.js',
      inject: {
        data: {
          // vueScript: `<script src='https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js'></script>`,
          // elementPlusScript: `<script src='<script src="//unpkg.com/element-plus"></script>'></script>`,
          // IconScript: `<script src='https://unpkg.com/@element-plus/icons-vue'></script>`
        }
      }
    }),
    miniImage({
      sharpOptions: {
        png: {
          quality: 70
        },
        jpeg: {
          quality: 70
        },
        jpg: {
          quality: 70
        },
        webp: {
          quality: 70
        }
      },
      convert: [
        { from: 'png', to: 'jpg' },
        { from: 'jpg', to: 'webp' },
        { from: 'jpeg', to: 'jpg' }
      ],
      cache: false
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
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
