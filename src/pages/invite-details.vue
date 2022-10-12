<template>
  <div class='invite-detail'>
    invite-detail page
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  onMounted(() => {

  })
</script>
<style type="text/css" lang='less' scoped>
  .invite-detail {

  }
</style>
