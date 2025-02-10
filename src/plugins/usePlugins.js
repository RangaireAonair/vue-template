import elementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

export function usePlugin(App) {
  App.use(elementPlus);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    App.component(key, component);
  }
}
