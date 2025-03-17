<script setup>
import { computed, reactive } from 'vue';
import useModal from '@/components/useModal.vue';
import useTable from '@/components/useTable.vue';
import styles from '@/style/App.module.scss';
import Menu from '@/components/Menu/index.vue';
const pageState = reactive({
  current: 'useTable'
});
const currentComponent = computed(() => {
  switch (pageState.current) {
    case 'useModal':
      return useModal;
    case 'useTable':
      return useTable;
  }
});
</script>

<template>
  <div :class="styles.commonLayout">
    <el-container>
      <el-header>
        <Menu v-model="pageState.current"></Menu>
      </el-header>
      <el-main>
        <component :is="currentComponent"></component>
      </el-main>
    </el-container>
  </div>
</template>
