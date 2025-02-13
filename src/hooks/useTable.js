import { h, renderSlot } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';
import { isObject } from '@/utils/typeCheck';
const hasTablePropsData = (target) => {
  return Array.isArray(target);
};
const defaultProps = {
  customFirst: true
};
const useTableColumns = (columns, TableProps, TableSlots) => {
  return columns.map((item, index) => {
    const { prop, label, slot, render, ...rest } = item;
    return h(
      ElTableColumn,
      {
        key: index,
        align: 'center',
        headerAlign: 'center',
        prop,
        label,
        ...rest
      },
      {
        default: () => {
          const params = TableProps.data[index];
          if (slot && typeof slot === 'string') {
            return renderSlot(TableSlots, slot, { ...params, prop, index });
          }
          if (render && typeof render === 'function') {
            try {
              return render(h, { ...params, prop, index });
            } catch (e) {
              return null;
            }
          }
        },
        header: () => renderSlot(TableSlots, 'header'),
        filterIcon: () => renderSlot(TableSlots, 'filter-icon')
      }
    );
  });
};

export const useTable = (columns, options = defaultProps) => {
  ElTable.inheritAttrs = false;
  ElTableColumn.inheritAttrs = false;

  const { customFirst = true } = isObject(options) ? options : {};
  return (_, { slots }) =>
    hasTablePropsData(_?.data)
      ? h('section', null, [
          h(
            ElTable,
            {
              border: true,
              stripe: true,
              ..._
            },
            {
              empty: () => renderSlot(slots, 'empty'),
              append: () => renderSlot(slots, 'append'),
              default: () => {
                const tableColumns = useTableColumns(columns, _, slots);

                const defaultSlots =
                  slots?.default && typeof slots?.default === 'function' ? slots?.default() : [];

                return customFirst
                  ? tableColumns.concat(defaultSlots)
                  : defaultSlots.concat(tableColumns);
              }
            }
          )
        ])
      : h(
          'div',
          {
            style: {
              textAlign: 'center',
              color: 'red'
            }
          },
          'Component Table Is Required Data Prop With Array!'
        );
};
