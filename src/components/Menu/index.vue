<script setup>
import { ref } from 'vue';

const { menuList } = defineProps({
  menuList: {
    type: Array,
    default: () => []
  }
});
const emits = defineEmits(['update:modelValue']);

const activeIndex = ref('Logo');
const menuItems = ref([
  {
    name: 'useModal',
    value: 'useModal'
  },
  {
    name: 'useTable',
    value: 'useTable'
  },
  ...menuList
]);

const handleSelect = (key) => {
  if (key !== 'Logo') {
    emits('update:modelValue', key);
  }
};
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="Logo">
      <img style="width: 100px; height: 40px" src="/vite.svg" alt="Element logo" />
    </el-menu-item>
    <template v-for="menuItem in menuItems" :key="menuItem.name">
      <el-menu-item :index="menuItem.value">{{ menuItem.name }}</el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
