<template>
  <div class="live-room">
    live-room page
  </div>
</template>
<script setup lang="ts">
  import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
  import { inject, onMounted } from 'vue'

  type TabItem = {
    title: string,
    id: string
  }

  const route:RouteLocationNormalizedLoaded = useRoute()

  // 弹出APP下载框
  const toggleDownloadAppDialog:any = inject('download')



  onMounted(() => {
    console.log('onActivated initialRoomDetail')
  })

</script>
<style type="text/css" lang="less">
  .live-room {
    :deep(.van-notice-bar) {
      height: .7rem;
    }
  }
</style>
