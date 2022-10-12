<template>
  <div class="match container re">
    match page
  </div>
</template>
<script setup lang="ts">
import { inject, computed, ref } from "vue"

type TabItem = {
  title: string
  id: string
}

const showDownload: any = inject("download")

const active = ref<number>(0)

const handleBeforeChange = (index: number) => {
  showDownload()
}
</script>
<style type="text/css" lang="less">
.match {

}
</style>
