<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
const { t } = useI18n()
const siteStore = useSiteStore()
const router = useRouter()
const scrollTop = ref(0)
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section3 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)
const windowHeight = ref(0)

import swp1to1 from '@/assets/images/swp1-1.png'
import swp1to2 from '@/assets/images/swp1-2.png'
import swp1to3 from '@/assets/images/swp1-3.png'
import swp1to4 from '@/assets/images/swp1-4.png'
import swp1to5 from '@/assets/images/swp1-5.png'

const slides = ref([
  { image: swp1to1, title: 'Slide 1' },
  { image: swp1to2, title: 'Slide 2' },
  { image: swp1to3, title: 'Slide 3' },
  { image: swp1to4, title: 'Slide 4' },
  { image: swp1to5, title: 'Slide 5' }
])

import swp2to1 from '@/assets/images/swp2-1.png'
import swp2to2 from '@/assets/images/swp2-2.png'
import swp2to3 from '@/assets/images/swp2-3.png'
import swp2to4 from '@/assets/images/swp2-4.png'

const slides2 = ref([
  { image: swp2to1, title: 'Slide 1' },
  { image: swp2to2, title: 'Slide 2' },
  { image: swp2to3, title: 'Slide 3' },
  { image: swp2to4, title: 'Slide 3' }
])

import scroll1to1 from '@/assets/images/scroll-1.webp'
import scroll1to2 from '@/assets/images/scroll-2.webp'
import scroll1to3 from '@/assets/images/scroll-3.webp'
import scroll1to4 from '@/assets/images/scroll-4.webp'
import scroll1to5 from '@/assets/images/scroll-5.webp'
import scroll1to6 from '@/assets/images/scroll-6.webp'
import scroll1to1hover from '@/assets/images/scroll-1-hover.webp'
import scroll1to2hover from '@/assets/images/scroll-2-hover.webp'
import scroll1to3hover from '@/assets/images/scroll-3-hover.webp'
import scroll1to4hover from '@/assets/images/scroll-4-hover.webp'
import scroll1to5hover from '@/assets/images/scroll-5-hover.webp'
import scroll1to6hover from '@/assets/images/scroll-6-hover.webp'

const scroll1 = ref([
  {
    title: "【WINYI】海馬寶寶吸吮按摩器",
    image: scroll1to1,
    image2: scroll1to1hover,
    price: 3888,
    oldPrice: 1888,
    stock: 50,
    link: '/',
    id: 1
  },
  {
    title: "【WINYI】企鵝寶寶換頭吸吮按摩器",
    image: scroll1to2,
    image2: scroll1to2hover,
    price: 3888,
    oldPrice: 1888,
    stock: 50,
    link: '/',
    id: 2
  },
  {
    title: "【WINYI】小黑鵝仿真手指按摩棒",
    image: scroll1to3,
    image2: scroll1to3hover,
    price: 3888,
    oldPrice: 1888,
    stock: 50,
    link: '/',
    id: 3
  },
  {
    title: "【WINYI】海后雙頭震動按摩棒",
    image: scroll1to4,
    image2: scroll1to4hover,
    price: 3888,
    oldPrice: 1888,
    stock: 50,
    link: '/',
    id: 4
  },
  {
    title: "【WINYI】冰藍海豚旋轉伸縮按摩棒",
    image: scroll1to5,
    image2: scroll1to5hover,
    price: 3888,
    oldPrice: 1888,
    stock: 50,
    link: '/',
    id: 5
  },
  {
    title: "【WINYI】海王雙頭震動吸吮器(預購)",
    image: scroll1to6,
    image2: scroll1to6hover,
    price: 3888,
    oldPrice: 1888,
    stock: 50,
    link: '/',
    id: 6
  }
])

const timer = ref(new Date().getTime())
const addCart = (item?: any) => {
  timer.value = new Date().getTime()
}




onMounted(() => {
  // document.documentElement.scrollTop = 0
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

// 目前分類
const currentCategory = ref('hots')

const onCurrentCate = (cate: any) => {
  currentCategory.value = cate
}

</script>

<template>
  <div class="cont">
    <headerTop :opaque="scrollTop >= 0" :timer="timer"></headerTop>
    <!-- <div class="index-bg">
      <div class="index-bg-content">
        <img src="@/assets/images/categories-bnr.webp" alt="">
      </div>
    </div> -->
    <liveStreaming></liveStreaming>
    <div class="content-nav">
      <div class="navs">
        <div class="nav" @click="onCurrentCate('hots')" :class="currentCategory === 'hots' ? 'nav-active' : ''">
          熱銷排行
        </div>
        <div class="nav" @click="onCurrentCate('woman')" :class="currentCategory === 'woman' ? 'nav-active' : ''">
          女士系列
        </div>
        <div class="nav" @click="onCurrentCate('man')" :class="currentCategory === 'man' ? 'nav-active' : ''">
          男士系列
        </div>
        <div class="nav" @click="onCurrentCate('toys')" :class="currentCategory === 'toys' ? 'nav-active' : ''">
          情趣周邊
        </div>
      </div>
    </div>
    <section class="section3" ref="section3">
      <div class="section3-content">
        <div class="tabs">
          <div class="tab">
            類型1
          </div>
        </div>
        <div class="section3-content-cont" ref="container">
          <div class="section3-cont-item" v-for="(item, index) in scroll1" :key="index"
            @click="navigateTo('/details?id=' + item.id)">
            <div class="shop-img">
              <img :src="item.image" alt="" class="img-normal" />

              <div class="shop-img-hover">
                <img :src="item.image2" alt="" class="" />
                <div class="shop-hover-btn" @click.stop="addCart(item)">加入購物車</div>
              </div>
            </div>
            <h4>{{ item.title }}</h4>
            <div class="section3-cont-item-price">
              <p class="section3-cont-item-price-new">NT$ {{ item.price }}</p>
              <p class="section3-cont-item-price-old">NT$ {{ item.oldPrice }}</p>
            </div>
            <span class="shopping">
              <i class="fa fa-shopping-cart"></i>
            </span>
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
  padding-block-start: 147.5px
  @media (max-width: 768px)
    padding-block-start: 110px
.button
  padding: 10px 30px
  margin-inline-end: 15px
  font-size: 16px
  font-weight: 500
  line-height: 30px
  border-radius: 5px
  color: #fff
  background: #baa38f
  transition: all .1s ease-in-out
  border: 1px solid #baa38f
  &:hover
    color: #baa38f
    background: #ffffff
.index-bg
  max-width: 100%
  width: 1170px
  padding: 0 15px
  margin: 20px auto
  display: flex
  align-items: center
  .index-bg-content
    display: flex
    align-items: center
    width: 1200px
    margin: 0 auto
    img
      max-width: 100%
      width: 100%
      aspect-ratio: 7/3
      object-fit: cover
.content-nav
  padding: 0 10px
  max-width: 100%
  width: 1170px
  margin: 20px auto 0
  .navs
    height: 45px
    display: flex
    justify-content: center
    background: #dbc2ab
    gap: 10px
    .nav
      color: #ffffff
      max-width: 25%
      width: 100px
      padding: 0 10px
      height: 100%
      line-height: 45px
      text-align: center
      &:hover
        background: #ad845e
    .nav-active   
      background: #ad845e !important

.section3
  transition: all .6s ease-in-out
  .section3-content
    position: relative
    max-width: 1170px
    margin: 0 auto
    padding: 30px
    .tabs
      display: flex
      justify-content: center
      margin-block: 0 30px
      .tab
        color: #5d5d5d
        font-size: 22px
        position: relative
        padding-block: 10px 15px
        &::after
          content: ''
          position: absolute
          bottom: 0
          left: 50%
          transform: translateX(-50%)
          height: 2px
          width: 33.33333%
          background: #baa38f
    .section3-content-cont
      display: grid
      grid-template-columns: repeat(4, 1fr)
      grid-gap: 16px
      cursor: grab
      .section3-cont-item
        min-width: calc(25% - 12px)
        display: flex
        flex-direction: column
        align-items: center
        // justify-content: center
        &:hover
          .shop-img-hover
            opacity: 1 !important
            img
              opacity: 1 !important
        .shopping
          width: 100%
          background: #f5f5f5
          border: #f0f0f0
          border-radius: 3px
          color: #baa38f
          text-align: center
          padding: 5px 0
          margin-top: 10px
          display: none
          &:hover
            background:#baa38f
            color: #f5f5f5
        .shop-img
          width: 100%
          .img-normal
            width: 100%
            object-fit: cover
          .shop-img-hover
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            opacity: 0
            transition: all .1s ease
            &::before
              content: ''
              position: absolute
              top: 0
              left: 0
              z-index: 1
              width: 100%
              height: 100%
              background: rgba(0,0,0,.3)

            img
              width: 100%
              object-fit: cover
              transition: all .25s ease
              opacity: 0

            .shop-hover-btn
              position: absolute
              left: 10px
              right: 10px
              bottom: 10px
              width: auto
              z-index: 2
              height: 40px
              border-radius: 3px
              font-size: 14px
              background: #fff
              padding: 10px 0
              min-height: 40px
              text-align: center
              transition: all .25s ease
              &:hover
                background: #baa38f
                color: #fff
        h4
          font-size: 14px
          line-height: 20px
          min-height: 40px
          color: #5d5d5d
          opacity: .8
          white-space: normal
        .section3-cont-item-price
          text-align: center
          font-weight: 600
        .section3-cont-item-price-new
          font-size: 16px
          color: #baa38f
        .section3-cont-item-price-old
          font-size: 16px
          text-decoration: line-through
          opacity: .8


@media (max-width: 1200px)
  .section3-content-cont
    grid-template-columns: repeat(3, 1fr) !important
    gap: 5px
@media (max-width: 768px)    
  .shop-img
    .shop-img-hover
      .shop-hover-btn
        display: none
  // 加入會員
  .btns
    .button
      padding: 5px 25px
      font-size: 14px
      font-weight: 500

  .content-nav
    font-size: 14px
    padding: 0
    .navs
      gap: 0

  // 熱銷排行
  .section3-content
    padding: 15px !important
  .section3-content-cont
    grid-template-columns: repeat(2, 1fr) !important
    gap: 5px
    h4
      white-space: nowrap

</style>
