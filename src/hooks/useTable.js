import { h } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';

export const useTable = (data, columns) => {
  return () =>
    h('section', null, [
      h(
        ElTable,
        {
          border: true,
          stripe: true,
          data: data
        },
        () =>
          columns.map((item, index) => {
            return h(ElTableColumn, {
              key: index,
              align: 'center',
              headerAlign: 'center',
              prop: item.prop,
              label: item.label
            });
          })
      )
    ]);
};
