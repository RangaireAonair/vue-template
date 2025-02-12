<script setup>
import { onMounted, ref } from 'vue';
import { useTable } from '@/hooks/useTable.js';
const columns = [
  { prop: 'name', label: 'Name' },
  { prop: 'date', label: 'Date' },
  { prop: 'address', label: 'Address' }
];
const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]);
const Table = useTable(tableData.value, columns);
onMounted(() => {
  setTimeout(() => {
    tableData.value.push({
      date: '1',
      name: '1',
      address: 'No.1'
    });
  }, 1000);
  setTimeout(() => {
    tableData.value.push({
      date: '2',
      name: '2',
      address: 'No.2'
    });
  }, 2000);
  setTimeout(() => {
    tableData.value.push({
      date: '3',
      name: '3',
      address: 'No.3'
    });
  }, 3000);
});
</script>

<template>
  <Table></Table>
</template>

<style scoped></style>
