<script setup>
import HelloWorld from '@/components/HelloWorld.vue';
import styles from '@/style/App.module.scss';
</script>

<template>
  <div :class="styles.commonLayout">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <HelloWorld msg="Vite + Vue" />
      </el-main>
    </el-container>
  </div>
</template>
