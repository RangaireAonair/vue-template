<script setup>
import { download } from '@/utils/download.js';
const Download = () => {
  download('http://localhost:9527/download/pdf', 'WebGL编程指南.pdf');
};
</script>

<template>
  <el-descriptions title="Download Page"> </el-descriptions>
  <el-button type="primary" icon="Download" @click="Download"> Download Button </el-button>
</template>

<style scoped></style>
