<template>
<div class="user">
  user-page
</div>
</template>

<script setup lang="ts">
import { reactive, toRefs , inject } from 'vue'
import {useUserStore} from "@/store/useUserStore";
const userStore = useUserStore()


const toggleDownloadAppDialog:any = inject('download')
</script>
<style type="text/css" lang='less'>
.user {

}
</style>
