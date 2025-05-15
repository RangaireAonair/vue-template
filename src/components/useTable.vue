<script setup>
import { useTable } from '@/hooks/useTable.js';
import { getPage } from '@/api/index.js';
const columns = [
  { type: 'index', width: 200, fixed: 'left', label: 'No' },
  { prop: 'name', label: 'Name' },
  {
    prop: 'Date',
    label: 'Date',
    render: (h, { Date }) => {
      return h('span', null, Date);
    }
  },
  { prop: 'title', label: 'title', slot: 'address' },
  { prop: 'content', label: 'content', slot: 'content', 'show-overflow-tooltip': true }
];
const tableData = ref([]);
const { Table, page, size } = useTable(columns, { customFirst: false });
onMounted(() => {
  getList();
});
const getList = () => {
  getPage({ page: page.value, size: size.value }).then((res) => {
    const [err, data] = res;
    if (!err) tableData.value = data;
  });
};
</script>

<template>
  <Table :data="tableData">
    <template v-slot:address="{ title }">
      <div>{{ title }}</div>
    </template>
    <template v-slot:content="{ content }">
      <div>{{ content }}</div>
    </template>
    <template v-slot:empty>
      <div>this is custom empty content</div>
    </template>
  </Table>
</template>

<style scoped></style>
