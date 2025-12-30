<script setup>
import styles from '@/style/App.module.scss';
import Menu from '@/components/Menu/index.vue';
const pageState = reactive({
  current: 'useTable'
});
const currentComponent = computed(() => {
  switch (pageState.current) {
    case 'useModal':
      return defineAsyncComponent(() => import('@/components/useModal.vue'));
    case 'useTable':
      return defineAsyncComponent(() => import('@/components/useTable.vue'));
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
