import { h, createApp, ref } from 'vue';
import { ElButton, ElDialog } from 'element-plus';
import { usePlugin } from '@/plugins/usePlugins';

const Fn = () => {};
const defaultProps = {
  cancelClick: Fn,
  confirmClick: Fn,
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  confirmButtonLoading: false,
  cancelButtonLoading: false,
  confirmButtonDisabled: false,
  cancelButtonDisabled: false,
  confirmButtonType: 'primary',
  cancelButtonType: 'default',
  NoConfirmButton: false,
  NoCancelButton: false
};
const footer = (options = defaultProps) => {
  const {
    confirmButtonText,
    cancelButtonText,
    cancelClick,
    confirmClick,
    confirmButtonLoading,
    confirmButtonDisabled,
    confirmButtonType,
    cancelButtonDisabled,
    cancelButtonLoading,
    cancelButtonType,
    NoConfirmButton,
    NoCancelButton
  } = { ...defaultProps, ...options };

  const generateButton = (NoConfirm = false, NoCancel = false) => {
    const ConfirmButton = NoConfirm
      ? null
      : h(
          ElButton,
          {
            type: confirmButtonType,
            disabled: confirmButtonDisabled,
            loading: confirmButtonLoading,
            onClick: confirmClick
          },
          () => confirmButtonText
        );
    const CancelButton = NoCancel
      ? null
      : h(
          ElButton,
          {
            type: cancelButtonType,
            disabled: cancelButtonDisabled,
            loading: cancelButtonLoading,
            onClick: cancelClick
          },
          () => cancelButtonText
        );
    return [CancelButton, ConfirmButton];
  };
  return () => h('section', { class: '' }, generateButton(NoConfirmButton, NoCancelButton));
};

const parseFunctionString = (str) => {
  try {
    return new Function('return' + str)();
  } catch (e) {
    return null;
  }
};

const checkObjectType = (obj) => {
  if (obj.__v_isVNode || obj.$options || (obj.render && typeof obj.render === 'function')) {
    return obj;
  } else if (parseFunctionString(obj)) {
    return parseFunctionString(obj);
  }
  throw new Error('Object type is required');
};
const useFooterDeFaultOptions = { Footer: false, FooterProps: defaultProps };
const useFooter = (options = useFooterDeFaultOptions) => {
  const { Footer, FooterProps, customFooter } = options;
  if (Footer && typeof Footer === 'boolean') {
    return footer(FooterProps);
  }

  if (customFooter && checkObjectType(customFooter)) {
    return customFooter;
  }
  return h('div', null);
};

export const useModal = (component, modalProps, options) => {
  const visible = ref(true);
  const div = document.createElement('div');
  const modal = () =>
    h(
      ElDialog,
      {
        ...modalProps,
        modelValue: visible.value,
        onClosed: () => unmount(),
        onClose: () => {
          visible.value = false;
        }
      },
      {
        default: () => h(component),
        footer: () => h(useFooter(options), null)
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
