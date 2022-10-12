<template>
<!--  <van-nav-bar-->
<!--      class="header-nav-bar"-->
<!--      title="帮助中心"-->
<!--      left-arrow-->
<!--      @click-left="$router.back()"-->
<!--  />-->
  <van-tabs class="tabs-bg"
            sticky
            v-model:active="activeTab"
            background="transparent"
            line-width="26px"
            line-height="3px"
            color="#fff"
            title-inactive-color="rgba(255,255,255, .7)"
            title-active-color="#fff"
  >
    <van-tab title="主播相关" name="1">
      <van-collapse accordion v-model="collapseLive">
        <van-collapse-item :name="item.id" v-for="item of helpLiveList" :key="item.id" @click.stop.prevent="handleClickCollapseItem(item)">
          <template #title>
            <div class="flex-middle-only item-title">
              <img class="m-r4" style="width: .48rem;" :src="item.icon" alt="">
              {{item.title}}
            </div>
          </template>
          <div style="height: 1rem;" class="flex-middle" v-if="helpContent[item.id] && !helpContent[item.id].content && helpContent[item.id]?.loading">
            <van-loading />
          </div>
          <div v-else v-html="helpContent[item.id]?.content"></div>
        </van-collapse-item>
      </van-collapse>
    </van-tab>
    <van-tab title="用户相关" name="2">
      <van-collapse accordion v-model="collapseUser">
        <van-collapse-item :name="item.id" v-for="item of helpUserList" :key="item.id" @click.stop.prevent="handleClickCollapseItem(item)">
          <template #title>
            <div class="flex-middle-only item-title">
              <img class="m-r4" style="width: .48rem;" :src="item.icon" alt="">
              {{item.title}}
            </div>
          </template>
          <div style="height: 1rem;" class="flex-middle" v-if="!helpContent[item.id]?.content && helpContent[item.id]?.loading">
            <van-loading />
          </div>
          <div v-else v-html="helpContent[item.id]?.content"></div>
        </van-collapse-item>
      </van-collapse>
    </van-tab>
  </van-tabs>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import {useRoute} from "vue-router";
  import { getHelpList, getHelpById } from '@/http/apis/protocol'

  type helpItem = {
    icon: string,
    id: number,
    profile: string,
    title: string,
    type: number
  }

  const route = useRoute()
  const activeTab = ref<string>(route.params.tab as string ?? '1')

  const collapseLive = ref<string>('')
  const collapseUser = ref<string>('')

  const helpLiveList = ref<helpItem[]>([])
  const helpUserList = ref<helpItem[]>([])
  // {[propName: number]: {loading: false, content: string}}
  const helpContent = ref<any>({})

  function handleClickCollapseItem(item: helpItem) {
    const id:number = item.id

    if (!helpContent.value[id].content) {
      helpContent.value[id].loading = true

      getHelpById({id})
          .then(res => {
            helpContent.value[id].loading = false

            if(res.status === 0) {
              helpContent.value[id].content = res.data.content
            }

            console.log('helpContent.value', helpContent.value[id])
          })
          .catch(() => helpContent.value[id].loading = false)
    }
  }

  getHelpList()
    .then(res => {
      if(res.status === 0) {
        const list = res.data ?? []

        list.forEach((item:helpItem) => {
          helpContent.value[item.id] = {loading: false, content: null}

          if(item.type === 1) {
            helpLiveList.value.push(item)
          } else {
            helpUserList.value.push(item)
          }
        })
      }
    })
</script>

<style type="text/css" lang="less">
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  :deep(.van-icon-arrow-left) {
    color: #fff;
  }

  .tabs-bg {
    .van-tabs__wrap {
      .bg-image('/images/tabbar/top-bg.png');
    }
    .van-collapse-item__title:after {
      display: block;
    }

    .van-collapse-item__content {
      background: none;
      >div {
        overflow: auto;
      }
    }

    .item-title {
      height: .6rem;
    }

    img {
      max-width: 94vw;
    }
  }
</style>
