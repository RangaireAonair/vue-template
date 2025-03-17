import { h, renderSlot, reactive, ref, toRefs, watchEffect } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';
import { isObject } from '@/utils/typeCheck';
import { usePagination } from '@/hooks/usePagination';

const pagination = usePagination();
const hasTablePropsData = (target) => {
  return Array.isArray(target);
};
const defaultProps = {
  customFirst: true,
  noPagination: false
};

const styleOptions = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
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
        default: (scoped) => {
          const params = TableProps.data[scoped.$index];
          if (slot && typeof slot === 'string') {
            return renderSlot(TableSlots, slot, { ...params, prop, index: scoped.$index });
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

  const pageState = reactive({
    page: 1,
    size: 10
  });

  const { customFirst = true, noPagination = false } = isObject(options) ? options : {};
  const Table = (_, { slots }) =>
    hasTablePropsData(_?.data)
      ? h('section', { style: { ...styleOptions } }, [
          h(
            ElTable,
            {
              border: true,
              stripe: true,
              style: { flex: 1 },
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
          ),
          noPagination
            ? null
            : h(pagination, {
                total: 12,
                'modelValue:current-page': pageState.page,
                'modelValue:pageSize': pageState.size,
                pageSizes: [10, 20, 30, 50],
                layout: 'total, sizes, prev, pager, next, jumper'
                // 'onUpdate:current-page': (value) => (pageState.page = value),
                // 'onUpdate:pageSize': (value) => (pageState.size = value)
              })
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
  watchEffect(() => {
    console.log(pageState.page);
    console.log(pageState.size);
  });
  return {
    Table,
    ...toRefs(pageState)
  };
};
