<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>

  <transition name="fade">
    <van-tabbar route safe-area-inset-bottom fixed
                inactive-color="#999"
                active-color="#3FE0DA"
                v-if="showTabBar"
    >
      <van-tabbar-item replace to="/match">
        赛程
        <template #icon="props">
          <i :class="`tabbar ${props.active ? 'match-active' : 'match'}`"></i>
        </template>
      </van-tabbar-item>

      <van-tabbar-item replace to="/information" icon="search">
        资讯
        <template #icon="props">
          <i :class="`tabbar ${props.active ? 'information-active' : 'information'}`"></i>
        </template>
      </van-tabbar-item>

      <van-tabbar-item replace to="/live" icon="search">
        直播
        <template #icon="props">
          <i :class="`tabbar ${props.active ? 'live-active' : 'live'}`"></i>
        </template>
      </van-tabbar-item>

      <van-tabbar-item replace to="/user" icon="search">
        我的
        <template #icon="props">
          <i :class="`tabbar ${props.active ? 'user-active' : 'user'}`"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </transition>
</template>
<script setup lang="ts">
  import {onBeforeMount, provide, ref, watch, nextTick, computed, onBeforeUnmount, onMounted} from 'vue'
  import {RouteLocationNormalizedLoaded, useRoute, useRouter} from 'vue-router'
  const router = useRouter()

  const route:RouteLocationNormalizedLoaded = useRoute()
  const showDownloadAppDialog = ref<boolean>(false)
  const showTabBar = ref<boolean>(false)

  let appDom:HTMLDivElement | null = null


  watch(() => route.path, (path) => {
    showTabBar.value = ['/match', '/information', '/live', '/eyes', '/user'].includes(path)
    if (appDom) appDom.style.paddingBottom = showTabBar.value ? '50px' : '0'
  })

  // 关闭显示下载APP
  provide('download', () => {
    showDownloadAppDialog.value = !showDownloadAppDialog.value
  })

  nextTick(() => {
    if (!appDom) appDom = document.getElementById('app') as HTMLDivElement
  })

  const timer = ref<any>(null)


  onMounted(() => {

  })

  onBeforeMount(() => {

  })

  onBeforeUnmount(() => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
  })

</script>
<style type="text/css" lang="less">
  @import "./css/sprite.less";
  #app {
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;

    .van-tabbar {
      box-shadow: 0 3px 4px rgba(17, 90, 64, 0.25);
      height: 1.1rem;
    }
    .van-tabbar-item--active {
      background: transparent;
    }
    background-color: #EDF0F3;

    .fade-enter-active,
    .fade-leave-active {
      bottom: 0;
      opacity: 1;
      transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      bottom: -50px;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
  }
</style>
