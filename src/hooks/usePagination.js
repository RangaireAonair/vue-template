import { ElPagination } from 'element-plus';
import { h } from 'vue';

export const usePagination = () => {
  ElPagination.inheritAttrs = false;

  return (props, { emit }) => {
    return h(
      ElPagination,
      {
        ...props
      },
      ''
    );
  };
};
