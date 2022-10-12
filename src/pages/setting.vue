<template>
    <div class="setting">
      <van-nav-bar
          title="设置"
          left-arrow
          @click-left="$router.back()"
      />
      <div class="bg-white flex-middle-only p-l16" style="height: .9rem">
        当前版本：{{version}}
      </div>
    </div>

</template>

<script setup lang="ts">
  const version = __VERSION__
</script>

<style type="text/css" lang="less">
  .setting {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
</style>
