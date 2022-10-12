<template>
  <div class="download">
    download page
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useAppConfigStore } from "@/store/useAppConfigStore";
import { judgeClient } from "@/utils/common";

const appConfig = useAppConfigStore();

const platform = ref(judgeClient().toLowerCase());

const timer = ref<any>(null);
const indicator = ref(1);

onBeforeUnmount(() => {
  if (timer.value) clearTimeout(timer.value);
});
</script>

<style lang="less" scoped>
.h5-download {
  width: 100%;
  background-color: #f5f6fa;
  padding-top: 0.48rem;
  text-align: center;

  .logo {
    width: 2.84rem;
    height: 0.84rem;
  }

  .main-image {
    width: 6.02rem;
    height: 5.08rem;
    margin: 0 auto;
    position: relative;
  }

  .main-img {
    width: 100%;
    height: 100%;
  }

  .main-tips {
    width: 6.24rem;
    height: 1.02rem;
    bottom: 1.12rem;
  }

  .main-text {
    bottom: 0.26rem;
  }

  .iphone-download {
    width: 2.64rem;
    height: 0.72rem;
    border-radius: 0.1rem;
    &.android {
      background: linear-gradient(90deg, #58c0aa 3.24%, #23568c 100.46%);
    }
    &.ios1 {
      background: linear-gradient(90deg, #ffac2f 0%, #ff530c 100%);
    }
    &.ios2 {
      background: linear-gradient(90deg, #04d7aa 3.24%, #0062ca 100.46%);
    }
  }

  .app-example {
    scroll-snap-type: x mandatory;
    white-space: nowrap;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .app-example-item {
    width: 100%;
    height: 100%;
    text-align: center;
    display: inline-block;
    scroll-snap-align: center;
    position: relative;
  }

  .example-title {
    color: #02a8a2;
  }

  .example-item-img {
    display: block;
    width: 80%;
    margin: auto;
    object-fit: contain;
    object-position: center;
  }

  .indicator {
    width: 1.32rem;
    height: 0.12rem;
    margin: 0 auto;
  }

  .indicator-item {
    width: 0.36rem;
    height: 0.12rem;
    border-radius: 0.2rem;
    background: #dbdbdb;
  }

  .indicator-active {
    background: #02a8a2;
  }
}
</style>
