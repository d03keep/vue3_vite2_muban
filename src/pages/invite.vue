<template>
  <div class='invite'>
    invite page
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from "vue-router";
  const router = useRouter()
  const route = useRoute()


  onMounted(() => {

  })
</script>
<style type="text/css" lang='less' scoped>
  .invite {

  }
</style>
