<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
const { t } = useI18n()
const router = useRouter()
const scrollTop = ref(0)
const section1 = ref<HTMLElement | null>(null)
const windowHeight = ref(0)
onMounted(() => {
  document.documentElement.scrollTop = 0
  if (window) {
    console.log('window', window.innerWidth)
    window.addEventListener('scroll', handleScroll)
  }
  windowHeight.value = window.innerHeight
  window.addEventListener('resize', () => {
    windowHeight.value = window.innerHeight
  })
})
const handleScroll = () => {
  scrollTop.value = window.scrollY
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>
<template>
  <div class="cont">
    <headerTop :opaque="scrollTop >= 0"></headerTop>
    <section class="section1" ref="section1">
      <div class="section1-tit">
        <h2>地址列表</h2>
      </div>
      <div class="section1-content">
        <div class="section1-content-items">
          <div class="content-item" v-for="(item, index) in 5">
            <div class="addr-cont">
              <div class="item-tit">
                <h3>
                  <span class="item-tit-name">王小明</span>
                  <span class="item-tit-phone"> 0912345678</span>
                </h3>
              </div>
              <div class="item-cont">
                <div class="item-cont-text">
                  <div class="item-cont-text-item">
                    <span class="item-cont-text-item-tit">地址：</span>
                    <span class="item-cont-text-item-cont">
                      台北市中山區中正路1號
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="edit-del">
              <span class="edit-icon">
                <svg t="1756277399813" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="18724" width="20" height="20">
                  <path
                    d="M846.9 511.7v279.9c0 33.6-22.4 56-56 56H231.2c-33.6 0-56-22.4-56-56V231.8c0-33.6 22.4-56 56-56h279.9c33.6 0 56-22.4 56-56s-22.4-56-56-56H231.2c-95.2 0-167.9 72.8-167.9 167.9v559.8c0 95.2 72.8 167.9 167.9 167.9H791c95.2 0 167.9-72.8 167.9-167.9V511.7c0-33.6-22.4-56-56-56s-56 22.4-56 56z m-459 67.2c-22.4-22.4-22.4-56 0-78.4L785.4 103c22.4-22.4 56-22.4 78.4 0 22.4 22.4 22.4 56 0 78.4L466.3 578.9c-22.4 22.4-61.6 22.4-78.4 0z m0 0"
                    p-id="18725"></path>
                </svg>

                <!-- <span>修改</span> -->
              </span>
              <span class="delete">
                <svg t="1756277951339" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="19730" width="20" height="20">
                  <path
                    d="M401.066667 805.262222a45.511111 45.511111 0 0 0 45.312-45.511111v-275.342222a45.340444 45.340444 0 1 0-90.652445 0v275.342222a45.511111 45.511111 0 0 0 45.340445 45.511111z m221.866666 0a45.511111 45.511111 0 0 0 45.340445-45.511111v-275.342222a45.340444 45.340444 0 1 0-90.652445 0v275.342222a45.511111 45.511111 0 0 0 45.312 45.511111zM458.837333 102.4h106.296889a45.511111 45.511111 0 0 0 0-91.022222h-106.296889a45.511111 45.511111 0 0 0-0.142222 91.022222zM944.64 197.973333H79.36a45.511111 45.511111 0 0 0 0 91.022223h28.444444v561.777777a161.422222 161.422222 0 0 0 160.739556 161.848889h486.627556a161.422222 161.422222 0 0 0 160.739555-161.848889V288.995556h28.444445a45.511111 45.511111 0 0 0 0.142222-91.022223z m-119.239111 652.8a70.599111 70.599111 0 0 1-70.087111 70.826667H268.544a70.599111 70.599111 0 0 1-70.087111-70.826667V288.995556h626.801778v561.777777z"
                    p-id="19731"></path>
                </svg>
                <!-- <span>刪除</span> -->
              </span>
              <span class="default"><svg t="1756127933796" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="8443" width="20" height="20" v-if="index != 0">
                  <path
                    d="M512 0C228.072727 0 0 228.072727 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0m0 46.545455c256 0 465.454545 209.454545 465.454545 465.454545s-209.454545 465.454545-465.454545 465.454545S46.545455 768 46.545455 512 256 46.545455 512 46.545455"
                    p-id="8444"></path>
                  <path
                    d="M512 777.309091h-9.309091c-146.618182-4.654545-260.654545-128-253.672727-274.618182 4.654545-146.618182 128-260.654545 274.618182-253.672727 20.945455 0 44.218182 4.654545 62.836363 9.309091 11.636364 4.654545 18.618182 16.290909 16.290909 27.927272-4.654545 11.636364-16.290909 18.618182-27.927272 16.29091-16.290909-4.654545-34.909091-6.981818-53.527273-9.309091-121.018182-4.654545-221.090909 88.436364-225.745455 209.454545-4.654545 121.018182 88.436364 221.090909 209.454546 225.745455 121.018182 4.654545 221.090909-88.436364 225.745454-209.454546 0-20.945455-2.327273-39.563636-6.981818-60.509091-2.327273-11.636364 4.654545-25.6 16.290909-27.927272 11.636364-2.327273 25.6 4.654545 27.927273 16.290909 4.654545 23.272727 9.309091 48.872727 6.981818 72.145454-4.654545 146.618182-121.018182 258.327273-262.981818 258.327273"
                    p-id="8445"></path>
                  <path
                    d="M686.545455 307.2c-18.618182 0-34.909091 16.290909-34.909091 34.909091s16.290909 34.909091 34.909091 34.909091 34.909091-16.290909 34.90909-34.909091-16.290909-34.909091-34.90909-34.909091"
                    p-id="8446"></path>
                </svg>
                <svg t="1756278069094" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="23405" width="20" height="20" v-if="index == 0">
                  <path
                    d="M512 512m-488.727273 0a488.727273 488.727273 0 1 0 977.454546 0 488.727273 488.727273 0 1 0-977.454546 0Z"
                    fill="#FFFFFF" p-id="23406"></path>
                  <path
                    d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m0-977.454545C256 46.545455 46.545455 256 46.545455 512s209.454545 465.454545 465.454545 465.454545 465.454545-209.454545 465.454545-465.454545S768 46.545455 512 46.545455z"
                    fill="#baa38f" p-id="23407"></path>
                  <path
                    d="M512 512m-325.818182 0a325.818182 325.818182 0 1 0 651.636364 0 325.818182 325.818182 0 1 0-651.636364 0Z"
                    fill="#baa38f" p-id="23408"></path>
                </svg>
                <span>{{ index == 0 ? '默認　　' : '設爲默認' }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footerBottom />
  </div>
</template>

<style scoped lang="sass">
.cont
  background: #fff !important
  padding-top: 147.5px
  @media (max-width: 768px)
    padding-top: 110px

.section1
  width: 1170px
  max-width: 100%
  margin: 0 auto
  padding: 30px 15px
  .section1-tit
    margin-top: 25px
  .section1-content
    margin-top: 60px
    margin-bottom: 60px
    .section1-content-items
      border-block: 1px solid #e5e5e5
      .content-item
        padding: 15px 20px
        border-block-end: 1px solid #e5e5e5
        display: flex
        justify-content: space-between
        align-items: center
        &:last-child
          border-block-end: none
        .edit-del
          display: flex
          align-items: center
          gap: 20px
          .edit-icon,.delete,.default
            display: flex
            align-items: center
            gap: 10px
            padding: 3px 0
            font-size: 14px
            transition: all .2s ease
            .icon
              width: 15px
              height: 15px
              fill: #3D3D3D 
            &:hover
              color: #baa38f
              .icon
                fill: #baa38f !important
                color: #baa38f !important
          .edit-icon
            .icon
              fill: #101010
          .default-active
            color: #baa38f
            font-weight: 700
            .icon
              fill: #baa38f
              color: #baa38f !important
          .delete .icon
            fill: #af3349 !important
        .item-tit
          font-weight: 700
@media (max-width: 768px)
  .content-item
    flex-direction: column
    align-items: flex-start !important
</style>
