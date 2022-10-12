<template>
  <div class="register">
    register page
  </div>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router'
import { useUserStore } from "@/store/useUserStore";

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

</script>
<style type="text/css" lang='less' scoped>
  .register {

  }
</style>
