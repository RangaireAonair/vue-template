import { createApp } from 'vue';
import '@/style.css';
import App from '@/App.vue';
import { usePlugin } from '@/plugins/usePlugins';
const Instance = createApp(App);

usePlugin(Instance);
Instance.mount('#app');
