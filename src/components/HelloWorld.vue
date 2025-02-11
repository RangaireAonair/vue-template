<script setup>
import { ref, h } from 'vue';
import { useModal } from '@/hooks/useModal.js';
// import { ElButton } from 'element-plus';
import testComponent from './testCom.vue';

defineOptions({
  inheritAttrs: false
});
const showModal = () => {
  const Component = h('div', null, [h('div', null, 'this is custom content')]);
  useModal(Component, { title: 'Hello RangCli' });
};
const showInfoModal = () => {
  const Component = h('div', null, [h('div', null, 'this is custom content')]);
  useModal(
    Component,
    { title: 'HelloWorld' },
    {
      // Footer: true,
      // FooterProps: {
      //   confirmClick: () => console.log('confirm'),
      //   cancelClick: () => console.log('Cancel')
      // },
      customFooter: testComponent
    }
  );
};
</script>

<template>
  <el-button type="primary" @click="showModal">use Modal</el-button>
  <el-button type="info" @click="showInfoModal">use Modal Info</el-button>
  <el-button loading>Default</el-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
