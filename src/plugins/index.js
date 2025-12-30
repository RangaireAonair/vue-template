import viteCompression from 'vite-plugin-compression';
import sri from 'vite-plugin-sri';
import vitePluginCspNonce from './vite-plugin-csp-nonce';
import miniImage from 'vite-plugin-minipic';
import Inspect from 'vite-plugin-inspect';
import createZipPlugin from './zip.js';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { name } from '../../package.json';
const sriPlugin = () =>
  sri({
    algorithms: ['sha384']
  });
const pressionPlugin = () =>
  viteCompression({
    /** 是否在控制控台打印被 压缩的文件信息 */
    verbose: false,
    /** 是否禁用压缩、默认为false */
    disable: false,
    /** 启用压缩的文件大小限制，单位是字节，默认为0 */
    threshold: 10240,
    ext: '.gz',
    algorithm: 'gzip',
    deleteOriginFile: false
  });

const miniImagePlugin = () =>
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
  });

const zipPlugins = () => createZipPlugin({ packageName: name });

const elementPlus = () => [
  AutoImport({
    imports: ['vue'],
    resolvers: [
      // 自动导入 Element Plus 组件
      ElementPlusResolver(),
      // 自动导入图标（前缀 `Icons`）
      IconsResolver({
        prefix: 'Icon',
        enabledCollections: ['ep'] // 启用 Element Plus 图标集
      })
    ]
  }),
  Components({
    resolvers: [
      // 自动注册 Element Plus 组件
      ElementPlusResolver(),
      // 自动注册图标组件
      IconsResolver({
        enabledCollections: ['ep'] // 启用 Element Plus 图标集
      })
    ]
  }),
  Icons({
    autoInstall: true, // 自动安装图标集
    compiler: 'vue3' // Vue 3 项目
  })
];
const visualizerPlugin = () =>
  visualizer({
    open: false
  });
export const vitePlugins = [
  sriPlugin(),
  Inspect({
    dev: false
  }),
  visualizerPlugin(),
  pressionPlugin(),
  vitePluginCspNonce(),
  miniImagePlugin(),
  zipPlugins(),
  ...elementPlus()
];
