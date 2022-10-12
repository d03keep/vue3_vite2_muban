<template>
  <div class="live container re">
    live page
  </div>
</template>
<script setup lang="ts">
  import { inject, computed, ref } from 'vue'

  type TabItem = {
    title: string,
    id: string
  }

  const toggleDownloadAppDialog:any = inject('download')

</script>
<style type="text/css" lang="less">
  .live {

  }
</style>
