<script setup>
import { ref, h } from 'vue';
import { useModal } from '@/hooks/useModal.js';
// import { ElButton } from 'element-plus';

defineOptions({
  inheritAttrs: false
});
const showModal = () => {
  useModal(h('div', null, [h('div', null, 'this is custom content')]), {}, { title: 'HelloWorld' });
};
</script>

<template>
  <el-button type="primary" @click="showModal">use Modal</el-button>
  <el-button type="info" @click="showModal" :loading="true">use Modal Info</el-button>
  <el-button>Default</el-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
