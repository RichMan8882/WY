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

import article1 from '@/assets/images/column1.jpg'
import article2 from '@/assets/images/column2.jpg'
import article3 from '@/assets/images/column3.jpg'

const article = ref([
  {
    title: '誰說泡泡浴是男生的特權？女性私房景點',
    image: article1,
    id: 1,
    introduction: '說到日本的風俗文化，第一個想到的可能是以男性客群為主的泡泡浴。但近年專為女性設計的風俗店正悄悄興起，今天就帶大家一起探索，看看她們的專屬女性向體驗吧！',
    link: '/',
    time: '2025-07-05'
  },
  {
    title: '情趣用品能帶出國嗎？帶你了解',
    image: article2,
    id: 1,
    introduction: '小編常常遇到 ig粉絲詢問想帶情趣玩具出國，但要放手提行李還是托運呢？這篇就來幫大家好好分析情趣玩具到底該怎麼放，以及推薦幾款帶出國不容易造成尷尬的情趣玩具！',
    link: '/',
    time: '2025-07-05'
  },
  {
    title: '情趣用品清潔指南',
    image: article3,
    id: 1,
    introduction: '常常遇到客人詢問情趣用品清潔相關問題，小編特別幫大家整理情趣用品防水等級、清洗等注意事項給大家～讓你不在擔心錯誤的使用習慣導致玩具壽命縮短！',
    link: '/',
    time: '2025-07-05'
  }
])

const timer = ref(new Date().getTime())
const addCart = (item?: any) => {
  timer.value = new Date().getTime()
}
const container = ref(null)
const items = ref([])
const prev = () => {
  if (container.value) {
    container.value.scrollBy({
      left: -300,
      behavior: 'smooth'
    })
  }
}

const next = () => {
  if (container.value) {
    container.value.scrollBy({
      left: 300,
      behavior: 'smooth'
    })
  }
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
  if (container.value) {
    items.value = container.value.querySelectorAll('.item')
    console.log('找到項目數量:', items.value.length)
  }
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
    <headerTop :opaque="scrollTop >= 0" :timer="timer"></headerTop>
    <liveStreaming></liveStreaming>
    <section class="section1" ref="section1">
      <div class="section1-content">
        <div class="text-block__item">
          <h1 class="text-block__title">WINYI 精品情趣</h1>
          <h4 class="text-block__subtitle">
            隱密素色包裝 無任何情趣字樣｜安心下單
          </h4>

          <div class="text-block__content">
            <p>⭕️ 官方 LINE 帳號再次遭停權 ⭕️</p>
            <p>&nbsp;</p>
            <p>若有產品保固等相關問題</p>
            <p>
              請改由LINE帳號
              <span style="color: #3598db"><strong><a href="" target="_blank">@630hrrid</a></strong>
              </span>
              處理，造成不便敬請見諒🙏
            </p>
          </div>
        </div>
      </div>
    </section>
    <div class="index-bg">
      <client-only>
        <UkSlideshow :options="{ autoplay: true }">
          <li v-for="(item, index) in slides" :key="index">
            <img :src="item.image" alt="" uk-cover />
          </li>
        </UkSlideshow>
      </client-only>
    </div>
    <section class="section2" ref="section2">
      <div class="section2-content">
        <div class="section2-content-tit">✦ 精 選 分 類 ✦</div>
        <div class="section2-content-cont">
          <a class="section2-cont-item">
            <div class="section2-cont-item-img">
              <img src="/assets/images/nav-1.webp" alt="" />
            </div>
            <h4>新品搶先看</h4>
          </a>
          <a class="section2-cont-item">
            <div class="section2-cont-item-img">
              <img src="/assets/images/nav-2.webp" alt="" />
            </div>
            <h4>初學者嚐鮮</h4>
          </a>
          <a class="section2-cont-item">
            <div class="section2-cont-item-img">
              <img src="/assets/images/nav-3.webp" alt="" />
            </div>
            <h4>進階老司機</h4>
          </a>
          <a class="section2-cont-item">
            <div class="section2-cont-item-img">
              <img src="/assets/images/nav-4.webp" alt="" />
            </div>
            <h4>情侶互動推薦</h4>
          </a>
          <a class="section2-cont-item">
            <div class="section2-cont-item-img">
              <img src="/assets/images/nav-5.webp" alt="" />
            </div>
            <h4>吸吮按摩器</h4>
          </a>
          <a class="section2-cont-item">
            <div class="section2-cont-item-img">
              <img src="/assets/images/nav-6.webp" alt="" />
            </div>
            <h4>震動跳蛋</h4>
          </a>
          <a class="section2-cont-item">
            <div class="section2-cont-item-img">
              <img src="/assets/images/nav-7.webp" alt="" />
            </div>
            <h4>震動按摩棒</h4>
          </a>
          <a class="section2-cont-item">
            <div class="section2-cont-item-img">
              <img src="/assets/images/nav-8.webp" alt="" />
            </div>
            <h4>凱格爾聰明球</h4>
          </a>
        </div>
      </div>
    </section>
    <section class="section3" ref="section3">
      <div class="section3-content">
        <div class="section3-content-tit">✦ 熱 銷 排 行 ✦</div>
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
        <div class="owl-prev" @click="prev">
          <svg class="slider-svg-prev-icon" viewBox="0 0 24 24" fill="#596480" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M16.8154 13.35L13.3578 16.8077C12.9472 17.2182 12.9472 17.8818 13.3578 18.2924C13.7683 18.7029 14.4319 18.7029 14.8425 18.2924L20.0925 13.0424C20.503 12.6318 20.503 11.9682 20.0925 11.5577L14.8425 6.30765C14.6377 6.1029 14.3689 6 14.1001 6C13.8313 6 13.5625 6.1029 13.3578 6.30765C12.9472 6.7182 12.9472 7.3818 13.3578 7.79235L16.8154 11.25L4.65009 11.25C4.06944 11.25 3.60009 11.7194 3.60009 12.3C3.60009 12.8807 4.06944 13.35 4.65009 13.35L16.8154 13.35Z">
            </path>
            <mask id="mask0_3488_15764" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="3" y="6" width="18"
              height="13">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.8154 13.35L13.3578 16.8077C12.9472 17.2182 12.9472 17.8818 13.3578 18.2924C13.7683 18.7029 14.4319 18.7029 14.8425 18.2924L20.0925 13.0424C20.503 12.6318 20.503 11.9682 20.0925 11.5577L14.8425 6.30765C14.6377 6.1029 14.3689 6 14.1001 6C13.8313 6 13.5625 6.1029 13.3578 6.30765C12.9472 6.7182 12.9472 7.3818 13.3578 7.79235L16.8154 11.25L4.65009 11.25C4.06944 11.25 3.60009 11.7194 3.60009 12.3C3.60009 12.8807 4.06944 13.35 4.65009 13.35L16.8154 13.35Z"
                fill="white"></path>
            </mask>
            <g mask="url(#mask0_3488_15764)"></g>
          </svg>
        </div>
        <div class="owl-next" @click="next">
          <svg class="slider-svg-next-icon" viewBox="0 0 24 24" fill="#596480" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M16.8154 13.35L13.3578 16.8077C12.9472 17.2182 12.9472 17.8818 13.3578 18.2924C13.7683 18.7029 14.4319 18.7029 14.8425 18.2924L20.0925 13.0424C20.503 12.6318 20.503 11.9682 20.0925 11.5577L14.8425 6.30765C14.6377 6.1029 14.3689 6 14.1001 6C13.8313 6 13.5625 6.1029 13.3578 6.30765C12.9472 6.7182 12.9472 7.3818 13.3578 7.79235L16.8154 11.25L4.65009 11.25C4.06944 11.25 3.60009 11.7194 3.60009 12.3C3.60009 12.8807 4.06944 13.35 4.65009 13.35L16.8154 13.35Z">
            </path>
            <mask id="mask0_3488_15764" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="3" y="6" width="18"
              height="13">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.8154 13.35L13.3578 16.8077C12.9472 17.2182 12.9472 17.8818 13.3578 18.2924C13.7683 18.7029 14.4319 18.7029 14.8425 18.2924L20.0925 13.0424C20.503 12.6318 20.503 11.9682 20.0925 11.5577L14.8425 6.30765C14.6377 6.1029 14.3689 6 14.1001 6C13.8313 6 13.5625 6.1029 13.3578 6.30765C12.9472 6.7182 12.9472 7.3818 13.3578 7.79235L16.8154 11.25L4.65009 11.25C4.06944 11.25 3.60009 11.7194 3.60009 12.3C3.60009 12.8807 4.06944 13.35 4.65009 13.35L16.8154 13.35Z"
                fill="white"></path>
            </mask>
            <g mask="url(#mask0_3488_15764)"></g>
          </svg>
        </div>
        <div class="more">
          <a href="" class="more-btn"> 查看更多 </a>
        </div>
      </div>
    </section>
    <section class="section4" ref="section4">
      <div class="section4-content">
        <div class="section4-content-tit">
          <h4>𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑𝐒</h4>
          <h2 class="tit-h2">會 員 招 募 中</h2>
        </div>
        <div class="section4-content-cont">
          <div class="section4-cont-item">
            <img src="/assets/images/member-pc.webp" alt="" class="img-pc" />
            <img src="/assets/images/member-mbi.webp" alt="" class="img-mbi" />
          </div>
          <div class="btns">
            <a href="" class="button"> 立即加入 </a>
            <a href="" class="button"> 會員説明 </a>
          </div>
        </div>
      </div>
    </section>
    <section class="section5" ref="section5">
      <div class="section5-content">
        <div class="section5-content-tit">✦ W 專 欄 ✦</div>
        <div class="section5-content-cont">
          <div class="section5-content-cont-item" v-for="(item, index) in article" :key="index"
            @click="navigateTo('/articledetails')">
            <img :src="item.image" alt="" />
            <div class="section5-content-cont-item-text">
              <h3>{{ item.title }}</h3>
              <p>
                {{ item.introduction }}
              </p>
              <div class="section5-content-item-time">{{ item.time }}</div>
              <div class="section5-content-cont-item-btn">
                <a href="" class="btn"> 閲讀全文 </a>
              </div>
            </div>
          </div>

          <div class="more">
            <a href="" class="more-btn" @click="navigateTo('/articlelist')"> 更多文章 </a>
          </div>
        </div>
      </div>
    </section>
    <footerBottom />
  </div>
</template>

<style scoped lang="sass">

.cont
  padding-top: 146.5px
  background: #fff !important
  @media (max-width:768px)
    padding-top: 110px
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
  width: 100%
  display: flex
  align-items: center
  .index-bg-content
    display: flex
    align-items: center
    width: 1200px
    margin: 0 auto
.section1
  transition: all .6s ease-in-out
  padding-top: 45px
  .section1-content
    max-width: 1140px
    padding: 15px
    margin: 0 auto
    text-align: center
    .text-block__item
      color: #5d5d5d
      .text-block__title,.text-block__subtitle,.text-block__content
        padding: 15px
      .text-block__title
        font-size: 24px
      .text-block__subtitle
        font-size: 18px
        opacity: .6
      .text-block__content
        font-size: 16px
    .content-swp
      padding: 30px
      margin: 5px 15px
    h3
      font-size: 16px
      padding: 15px
.section2
  .section2-content
    max-width: 1170px
    margin: 0 auto
    padding: 30px 30px 15px
    // margin: 40px auto 0
    .section2-content-tit
      font-size: 24px
      font-weight: 600
      padding: 15px
      line-height: 36px
      text-align: center
    .section2-content-cont
      padding: 30px
      display: grid
      grid-template-columns: repeat(4, 1fr)
      grid-gap: 20px
      .section2-cont-item
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        &:hover
          .section2-cont-item-img
            &::before
              opacity: 1 !important
        .section2-cont-item-img
          &::before
            content: ''
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            background: rgba(0,0,0,.4)
            opacity: 0
            z-index: 1
            transition: all .3s ease-in-out
          img
            width: 100%
        h4
          font-size: 16px
          line-height: 34px
          padding-top: 15px
          font-weight: 600
// 查看更多
.more
  display: flex
  justify-content: center
  align-items: center
  padding: 15px
  .more-btn
    display: flex
    margin: 15px auto 15px
    align-items: center
    justify-content: center
    padding: 6px 80px
    border-radius: 3px
    word-break: break-word
    text-align: center
    font-size: 1rem
    background: #baa38f
    border: 1px solid #baa38f
    color: #ffffff
    &:hover
      color: #baa38f
      background: #ffffff
.section3
  transition: all .6s ease-in-out
  .section3-content
    position: relative
    max-width: 1170px
    margin: 0 auto
    padding: 30px
    .slider-svg-prev-icon,.slider-svg-next-icon
      width: 18px
      height: 18px
    .slider-svg-prev-icon
      transform: rotate(180deg)
    .owl-prev,.owl-next
      cursor: pointer
      position: absolute
      bottom: 50%
      transform: translateY(calc( 50% - 3.2rem  ))
      z-index: 3
      width: 50px
      height: 50px
      display: flex
      font-size: 14px
      margin: 5px
      padding: 4px 7px
      border-radius: 3px
      align-items: center
      justify-content: center
      background-color:#fff
      box-shadow: 0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .23)
      pointer-events: all
    .owl-prev
      left: 0
    .owl-next
      right: 0
    .section3-content-tit
      font-size: 24px
      font-weight: 600
      padding: 15px
      line-height: 36px
      text-align: center
    .section3-content-cont
      display: flex
      grid-gap: 16px
      overflow-x: auto
      scroll-snap-type: x mandatory
      scroll-behavior: smooth
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
.section4
  .section4-content
    max-width: 1170px
    margin: 0 auto
    .section4-content-tit
      font-weight: 600
      padding: 15px
      line-height: 36px
      text-align: center
      h4,h2
        color: #777
        font-size: 20px
    .section4-content-cont
      .btns
        display: flex
        justify-content: center
        align-items: center
        gap: 10px
      .btns
        .button
          margin: 0
      .section4-cont-item
        padding: 15px
        .img-pc
          width: 100%
        .img-mbi
          width: 100%
          display: none

.section5
  .section5-content
    max-width: 1170px
    margin: 50px auto
    padding: 30px 30px 15px
    // margin: 40px auto 0
    .section5-content-tit
      font-size: 24px
      padding: 15px
      line-height: 36px
      text-align: center
    .section5-content-cont
      padding: 30px 0
      .section5-content-cont-item
        position: relative
        display: flex
        scroll-snap-align: start
        gap: 1.5rem
        margin-bottom: 3rem
        img
          border-radius: 3px
          width: 33.33333%
        .section5-content-cont-item-text
          flex: 1
          position: relative
          padding-bottom: 2.5rem
          color: #1f2937
          h3
            font-size: 1.125rem
            font-weight: 700
            margin: 0.7rem 0
          p
            font-size: 1rem
            line-height: 1.5
            margin-bottom: 16px
          .section5-content-item-time
            font-size: 12px
          .section5-content-cont-item-btn
            position: absolute
            bottom: 0
            width: 100%
            display: flex
            justify-content: flex-end
            .btn
              background-color: #baa38f
              color: white
              padding: 0.5rem 1rem
              font-size: 14px
              border-radius: 0.375rem
              &:hover
                background-color: #9c8b6f
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
  .section4-cont-item
    .img-pc
      display: none
    .img-mbi
      display: block !important
  // 熱銷排行
  .section3-content-cont .section3-cont-item
    min-width: calc( 50% - 15px ) !important
  // 精選分類
  .section2-content-cont
    padding: 0 !important
    grid-template-columns: repeat(3, 1fr) !important
    gap: 15px
    h4
      white-space: nowrap
  // banner1
  .content-swp
    padding: 0 !important
    margin: 0 !important
  .section5-content-cont-item
    display: block !important
    img
      width: 100% !important
  .more-btn
    margin: 0 !important
    width: 100% !important
  // 購物車-mobile
  .shopping
    display: block !important
  .shopping-cart-container
    background: rgba(0,0,0,0.1) !important
  .shopping-cart-conts
    overflow-y: auto !important 
    max-height: 100dvh !important
    padding-block-end: 65px
  .shopping-cart
    top: 0 !important
    left: -100% !important
    right: auto !important
    width: 60% !important
    height: 100vh !important
    min-height: 100vh !important
    max-height: 100vh !important
    overflow: hidden !important
    border: none !important
    .checkout
      position: absolute !important
      width: 100% !important
  .shopping-cart-active
    top: 0 !important
    right: auto !important
    left: 0 !important
    width: 60% !important

// 購物車
.shopping-cart-container
  position: fixed
  top: 0
  right: 0
  width: 100%
  height: 100vh
  background: rgba(0,0,0,0)
  transition: all .1s ease-in-out
  z-index: 67
.shopping-cart
  position: fixed
  top: 150px
  right: -280px
  width: 250px
  z-index: 68
  background: #ffffff
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  border: 1px solid #f7f7f7
  transition: all 0.3s ease-in-out
  overflow-y: auto
  max-height: calc(100vh - 170px)
  .shopping-cart-conts
    .shopping-cart-cont
      position: relative
      padding: 15px 15px 40px
      display: flex
      justify-content: space-between
      border-bottom: 1px solid #f6f6f6
      &:last-child
        border-bottom: none
      img
        width: 50px
        height: 50px
        object-fit: cover
        margin-right: 15px
      h5
        color: #999
        font-size: 13px
        padding-bottom: 2px
        flex: 1
      .specification
        position: absolute
        bottom: 0
        left: 0
        font-size: 14px
        width: 100%
        .price
          padding: 0 15px 10px 80px
          display: flex
          justify-content: space-between
          .price-text
            padding: 0 3px
          .delete
            color: #999
            fill: #999
            cursor: pointer
            transition: all .25s ease
            &:hover
              color: #666
              transform: scale(1.05)
  .checkout
    padding: 10px 15px 15px
    position: sticky
    bottom: 0
    background: #fff
    .ck-btn
      width: 100%
      background: #baa38f
      padding: 6px 12px
      border-radius: 4px
      color: #ffffff
      border: 1px solid #baa38f
      cursor: pointer
      text-align: center
      &:hover
        background: #ffffff
        color: #baa38f
  .empty
    padding: 40px 15px
    text-align: center
    font-size: 14px
.shopping-cart-active
  top: 150px
  right: 5%
  width: 300px


</style>
