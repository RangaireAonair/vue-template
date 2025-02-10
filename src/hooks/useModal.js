import { h, createApp, ref, defineComponent } from 'vue';
import { ElButton, ElDialog } from 'element-plus';
import { usePlugin } from '@/plugins/usePlugins';

const Fn = () => {};
const defaultProps = {
  cancelClick: Fn,
  confirmClick: Fn,
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel'
};
const footer = (options = {}) => {
  const { confirmButtonText, cancelButtonText, cancelClick, confirmClick } = {
    ...defaultProps,
    ...options
  };
  return () =>
    h('section', { class: '' }, [
      h(ElButton, { type: 'default', onClick: () => cancelClick }, () => cancelButtonText),
      h(
        ElButton,
        { type: 'primary', loading: true, disabled: true, onClick: () => confirmClick },
        () => confirmButtonText
      )
    ]);
};
export const useModal = (component, props, options) => {
  const visible = ref(true);
  const div = document.createElement('div');
  const modal = () =>
    h(
      ElDialog,
      {
        ...options,
        modelValue: visible.value,
        onClosed: () => unmount(),
        onClose: () => {
          visible.value = false;
        }
      },
      {
        default: () => h(component, props),
        footer: () => h(footer(), null)
      }
    );
  const unmount = () => {
    App.unmount();
    document.body.removeChild(div);
  };
  const App = createApp(modal);
  App.mount(div);
  usePlugin(App);
  document.body.appendChild(div);
};
