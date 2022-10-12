<template>
  <div class="information re">
    information page
  </div>
</template>
<script setup lang="ts">
import { inject, computed, ref } from "vue"

type TabItem = {
  title: string
  id: string
}

const toggleDownloadAppDialog: any = inject("download")

const active = ref<number>(0)
</script>
<style lang="less" scoped>

.information {

}
</style>
