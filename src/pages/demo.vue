<template>
  <div>demo演示页， 只在 DEV 开发环境生效 </div>

  <div>
    {{numArr}}
  </div>
</template>
<script setup lang="ts">
  import { computed, ref } from "vue";

  const num = ref(96)

  const numArr = computed(() => {

    return num.value.toString().split('')
  })
</script>
<style type="text/css">

</style>