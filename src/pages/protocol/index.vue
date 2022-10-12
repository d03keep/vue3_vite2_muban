<template>
  <div class="p-l12 p-r12 p-t10 content">
    隐私政策
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  const route = useRoute()

  const id:number = Number(route.params.id || 0)
</script>

<style type="text/css" lang="less" scoped>
  .content {

  }
</style>
