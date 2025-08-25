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
                <svg t="1756127871812" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="4489" width="20" height="20">
                  <path
                    d="M870.741333 361.685333h72.533334v601.770667c0 32-26.752 57.557333-59.733334 57.557333H132.266667c-32.853333 0-59.733333-25.6-59.733334-57.472V160.725333c0-31.786667 26.922667-57.429333 59.562667-57.429333H673.706667v72.533333H145.066667V948.48h725.674666V361.685333zM191.488 698.026667h263.509333v85.077333H191.488V698.026667z m0-178.389334h441.941333v85.077334H191.488v-85.077334z m550.186667-95.786666a41.898667 41.898667 0 0 1-72.533334-41.685334l179.456-331.690666a41.898667 41.898667 0 0 1 72.32 42.112l-179.2 331.264z"
                    p-id="4490"></path>
                </svg>
                <!-- <span>修改</span> -->
              </span>
              <span class="delete"><svg t="1756127910355" class="icon" viewBox="0 0 1066 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="7229" width="20" height="20">
                  <path
                    d="M1032.652303 255.999311h-99.641889v736.089685a32.688841 32.688841 0 0 1-33.476524 31.901158H166.594937a32.688841 32.688841 0 0 1-33.476524-31.901158V255.999311H33.476524a31.901158 31.901158 0 1 1 0-63.802316h233.154143V31.903521A32.688841 32.688841 0 0 1 299.71335 0.002363h466.702127a32.688841 32.688841 0 0 1 33.082683 31.901158v160.293474h233.154143a31.901158 31.901158 0 1 1 0 63.802316z m-299.71335-191.80079H333.189874v127.998474h399.749079V64.198521zM866.451208 255.999311H200.071461v704.188527H866.451208V255.999311zM399.74908 831.795522H333.189874V383.997785h66.559206v447.797737z m166.594937 0h-66.559207V383.997785h66.559207v447.797737z m166.594936 0h-66.559206V383.997785h66.559206v447.797737z"
                    p-id="7230"></path>
                </svg>
                <!-- <span>刪除</span> -->
              </span>
              <span class="default" :class="index == 0 ? 'default-active' : ''"><svg t="1756127933796" class="icon"
                  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8443" width="20"
                  height="20">
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
      padding: 0 20px
      .content-item
        padding: 15px 0
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
            fill: #a94442 !important
        .item-tit
          font-weight: 700
</style>
