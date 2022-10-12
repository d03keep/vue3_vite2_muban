<template>
  <div class="app-container">
    <div class="download">
      <div class="top-download">
        <div class="top-left">
          <img class="" src="/images/download/one/people.png" />
        </div>
        <div class="top-right">
          <div class="top-right-logo">
            <img src="/images/download/one/live.png" />
          </div>
          <div class="top-title-logo">
            <img src="/images/download/one/duye.png" />
          </div>
          <div class="top-text">
            <div class="">网红女神赛事直播 行业专家赛前预测</div>
            <div class="">体育视听盛宴 万千佳人相伴</div>
          </div>
          <div class="top-download-type">
            <div class="type-left flex-between flex-column">
              <qr-code class="qrcode" :value="qrcode_address" :size="138" style="width: 100%" />
              <div class="des">扫描二维码下载APP</div>
            </div>
            <div class="type-right">
              <div class="android_btn" @click="downloadApp('android')">
                <img src="/images/download/one/android.png" />
                <div>Android下载</div>
              </div>
              <div class="ios_btn" @click="downloadApp('ios')">
                <img src="/images/download/one/ios.png" />
                <div>iPhone下载</div>
              </div>
              <div class="des">官网地址：{{ site }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="middle-download">
        <div class="middel-download-item">
          <div class="item-top">
            <div class="text-a">魅力直播解说</div>
            <div class="text-b">看比赛就要一起嗨</div>
          </div>
          <div class="item-bottom">
            <img src="/images/download/one/mobile1.png" />
          </div>
        </div>
        <div class="middel-download-item">
          <div class="item-top">
            <div class="text-a">精准赛事直播</div>
            <div class="text-b">专业解读精准分析</div>
          </div>
          <div class="item-bottom">
            <img src="/images/download/one/mobile2.png" />
          </div>
        </div>
        <div class="middel-download-item">
          <div class="item-top">
            <div class="text-a">火爆体育社区</div>
            <div class="text-b">赛事活动主播热推中</div>
          </div>
          <div class="item-bottom">
            <img src="/images/download/one/mobile3.png" />
          </div>
        </div>
      </div>

      <div class="bottom-download">
        <div class="bottom-top">
          <div class="bottom-top-left">安装教程</div>
          <div class="bottom-top-right">
            <div class="text-top">需在同一网络环境下下载安装和注册，勿切换网络若无法正常下载，请使用手机自带浏览器</div>
            <div class="text-bottom">打开（Chrome谷歌浏览器、Safari浏览器）</div>
          </div>
        </div>

        <div class="bottom-bottom">
          <div class="text-des">
            <div class="logo-blue-ios">
              <img src="/images/download/one/ios-blue.png" />
            </div>
            <div class="text-title">IOS如何安装？</div>
          </div>
          <div class="step-area">
            <div class="setp">1.APP 下载完成后，请打开「设置」>点选「通用」选项</div>
            <div class="setp">2.点选「设备管理」</div>
            <div class="setp">3.点选「信任」APP即完成设置</div>
          </div>
          <div class="dext-step_area">
            <div class="step-item">
              <img src="/images/download/one/step1.png" />
            </div>
            <div class="step-item">
              <img src="/images/download/one/step2.png" />
            </div>
            <div class="step-item">
              <img src="/images/download/one/step3.png" />
            </div>
            <div class="step-item">
              <img src="/images/download/one/step4.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppConfigStore } from "@/store/useAppConfigStore"
import { onMounted, watch, ref } from "vue"
import { useRoute } from "vue-router"
const appConfig = useAppConfigStore()

const route = useRoute()

const qrcode_address = ref("")
const android_address = ref("")
const ios_address = ref("")
const site = ref("")

watch(appConfig, (newValue, oldValue) => {
  if (newValue) {
    android_address.value = appConfig.dl_android
    ios_address.value = appConfig.dl_ios
    site.value = appConfig.site_domain
    qrcode_address.value = appConfig.dl_qrcode
  }
})

onMounted(() => {
  // 创建cnzz统计js
  const script: any = document.createElement("script")
  script.src = "https://v1.cnzz.com/z_stat.php?id=1280800852&web_id=1280800852"
  script.language = "JavaScript"
  document.body.appendChild(script)
})

const downLoadQRcode = (): void => {
  const canvas = document.getElementById("canvasDom") as HTMLCanvasElement
  const url = canvas.toDataURL("image/png") // 通过 toDataURL 返回一个包含图片展示的 data URI
  const aDom = document.createElement("a")
  aDom.download = "猎鹰直播" // 设置下载的文件名
  aDom.href = url
  document.body.appendChild(aDom)
  aDom.click()
  aDom.remove()
}

function downloadApp(type: string) {
  let download_address = ""
  if (type === "android") {
    download_address = android_address.value
  } else {
    download_address = ios_address.value
  }
  window.location.href = download_address
}
</script>

<style lang="less" scoped>
.app-container {
  padding-top: 64px;
  position: relative;
  background-image: url("/images/download/beijing.png");
  background-repeat: no-repeat;
  background-size: cover;

  .download {
    width: 1140px;
    margin: 0 auto;

    .top-download {
      position: relative;
      width: 1140px;
      height: 575px;

      .top-left {
        position: absolute;
        left: -100px;
        top: 125px;
      }

      .top-right {
        position: absolute;
        right: 80px;
        top: 60px;
        text-align: center;

        .top-right-logo {
          margin-bottom: 32px;
          img {
            width: 191px;
          }
        }

        .top-title-logo {
          margin-bottom: 25px;
          img {
            width: 464px;
          }
        }

        .top-text {
          // width: 366px;
          height: 62px;
          font-family: PingFangSC;
          font-size: 22.5px;
          text-align: center;
          color: #7a7a7a;
          line-height: 1.34;
          margin-bottom: 30px;
        }

        .top-download-type {
          display: flex;
          justify-content: center;

          .type-left {
            margin-right: 33px;

            .qrcode {
              width: 138px;
              height: 138px;
              box-shadow: 0 2px 4px 0 #296290;
              border-radius: 10px;
              padding: 6px;
            }

            .des {
              color: #818ba3;
              font-family: PingFangSC;
              font-size: 13px;
              font-weight: 500;
              padding-top: 20px;
            }
          }

          .type-right {
            .des {
              color: #818ba3;
              font-family: PingFangSC;
              font-size: 13px;
              font-weight: 500;
              padding-top: 23px;
            }

            .android_btn {
              cursor: pointer;
              margin-top: 2px;

              img {
                margin-right: 20px;
              }

              display: flex;
              align-items: center;
              padding-left: 30px;
              width: 186px;
              height: 51px;
              border-radius: 10px;
              font-size: 13px;
              line-height: 51px;
              color: #fff;
              margin-bottom: 32px;
              background-image: linear-gradient(to right, #58c0aa, #23568c);
            }
          }

          .ios_btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            color: #fff;
            padding-left: 30px;
            width: 186px;
            height: 51px;
            border-radius: 10px;
            background-image: linear-gradient(to right, #fbb03b, #f15a24);
            font-size: 13px;
            line-height: 51px;

            img {
              margin-right: 20px;
            }
          }
        }
      }
    }

    .middle-download {
      width: 1140px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 34px;
      padding: 0 97px;

      .middel-download-item {
        text-align: center;
        width: 532px;

        .item-top {
          width: 259px;
          margin-bottom: 25px;

          .text-a {
            font-size: 26px;
            color: #41939d;
            font-family: PingFangSC;
            font-weight: 500;
            height: 37px;
            line-height: 37px;
          }

          .text-b {
            font-family: PingFangSC;
            font-size: 15px;
            font-weight: 500;
            color: #69728d;
            line-height: 1.05;
            letter-spacing: 0.53px;
            height: 21px;
          }
        }

        .item-bottom {
          width: 259px;
          height: 532px;
          font-size: 0;
        }
      }
    }

    .bottom-download {
      width: 1140px;

      .bottom-top {
        display: flex;
        align-items: center;
        width: 1140px;
        padding: 0 30px;
        padding-bottom: 23px;
        margin-bottom: 24px;
        border-bottom: 1px solid #41939d;

        .bottom-top-left {
          font-family: PingFangSC;
          font-size: 26px;
          font-weight: 500;
          line-height: 0.6;
          letter-spacing: normal;
          text-align: left;
          color: #41939d;
        }

        .bottom-top-right {
          border-left: 1px solid #69728d;
          font-family: PingFangSC;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.57;
          letter-spacing: 0.49px;
          text-align: left;
          color: #69728d;
          margin-left: 12px;
          padding-left: 12px;
        }
      }

      .bottom-bottom {
        .text-des {
          padding: 0 30px;
          display: flex;
          align-items: center;
          margin-bottom: 24px;

          .logo-blue-ios {
            width: 30px;
            height: 37px;
            font-size: 0;
            margin-right: 10px;

            img {
              height: 30px;
            }
          }

          .text-title {
            line-height: 37px;
            font-size: 26px;
            font-weight: 500;
            // line-height: 0.6;
            letter-spacing: 0.78px;
            color: #41939d;
          }
        }

        .step-area {
          padding: 0 20px;
          font-size: 15px;
          color: #69728d;
          font-weight: 500;
          line-height: 2;
          letter-spacing: 0.53px;
          margin-bottom: 24px;

          .setp {
            margin-right: 30px;
          }
        }

        .dext-step_area {
          display: flex;
          padding-bottom: 64px;
          justify-content: space-around;

          .step-item {
            width: 253px;
            height: 210px;
          }
        }
      }
    }
  }
}
</style>
