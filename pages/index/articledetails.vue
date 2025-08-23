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

// 所有分類
const categorys = ref([
  {
    name: '熱銷排行',
    id: 'hots'
  },
  {
    name: '女士系列',
    id: 'woman'
  },
  {
    name: '男士系列',
    id: 'man'
  },
  {
    name: '情趣周邊',
    id: 'toys'
  },

])

// 目前分類
const currentCategory = ref('hots')

const onCurrentCate = (cate: any) => {
  currentCategory.value = cate
}

</script>

<template>
  <div class="cont">
    <headerTop :opaque="scrollTop >= 0" :timer="timer"></headerTop>
    <div class="index-bg">
      <div class="title-h1 title-color text-center">
        誰說泡泡浴是男生的特權？女生的私房景點：東京秘密基地
      </div>
      <div class="part">說到日本的風俗文化，許多人第一個想到的可能是以男性客群為主的泡泡浴、牛郎店或是AV文化。但妳知道嗎？近年來，專為女性設計的風俗店正在悄悄興起，讓女生也能享受極致的身心放鬆體驗。
        如果妳曾經好奇「女生可以去的風俗店有什麼？」或是「日本女生都怎麼放鬆？」那麼這篇文章就是為妳而寫的！今天就帶大家一起探索東京女生的私房秘密基地，看看她們的專屬女性向體驗吧！ </div>
      <img src="@/assets/images/categories-bnr.webp" alt="">
      <div class="title-h2 title-color title-color-after">
        女生專屬的日本風俗店大揭密！你一定要知道這些關鍵字
      </div>
      <div class="part">在東京，有不少為女性客人量身打造的風俗店，日本最有名的女性用風俗店「東京秘密基地」在全國有60家分店。這些店家不只環境講究，服務內容也貼心細緻，讓妳完全不會有不自在的感覺，想了解更仔細的話
        可以在 dcard 或 google 搜尋：東京秘密基地、女性用風俗、秘密基地、女風 都可以找到相關資訊。</div>
      <img src="@/assets/images/categories-bnr.webp" alt="">
      <div class="title-h2 title-color title-color-after">
        女性風俗店基本服務
      </div>
      <div class="part">
        服務內容主要為男性店員以按摩的方式為中心滿足躺在床上的顧客，會幫你洗泡泡浴、在床上全身按摩、聊天挑逗、全身親舔、各種做前戲（愛撫、親吻、甚至是舔妹妹、手指愛撫及指交），有些還會問你要不要愛愛，又稱本番。</div>
      <div class="part">
        事實上，無論是男性風俗還是女性風俗，日本法律都明文禁止店家提供本番行為（即性行為）。然而，在女性風俗店內，仍有不少店員與客人發生過本番行為。根據媒體的問卷調查顯示，曾經光顧女性風俗店的顧客中，高達 65%
        的人表示曾與店員發生過本番行為。
        雖然日本法律嚴格禁止風俗店提供本番服務，但泡泡浴店卻能夠合法經營。這是因為店家聲稱泡泡浴店只是單純的洗浴設施，而若與客人因相處產生戀愛感情，進而發生性行為，那麼這就被視為「自願發生的親密行為」，而非店方提供的服務內容。因此，泡泡浴店便能在這種法律灰色地帶中運作，成功躲過法律的制裁。
      </div>
      <img src="@/assets/images/categories-bnr.webp" alt="">
      <div class="title-h2 title-color title-color-after">
        女性風俗店 基本ＱＡ
      </div>
      <div class="part">
        <p>Ｑ1:外國人可以使用嗎？</p>
        <p>A:完全可以。</p>
      </div>
      <div class="part">
        <p>Q2:需要提供身份證明嗎？</p>
        <p>A:不用，預約的時候可以用假名，施術前請你填寫的同意書也可以簽假名。</p>
      </div>
      <div class="part">
        <p>Q3:需要會日文嗎？</p>
        <p>A:不太會也沒關係，男生會現場使用翻譯機跟你溝通。會日文的話更好，跟男生可以談論的話題會更廣，樂趣更多，體驗會更完整。（他在你耳邊說色色的話會更有感覺）</p>
      </div>
      <div class="part">
        <p>Q4:需要日本手機號碼嗎？</p>
        <p>A:沒有的話可以用電子信箱，有的話更好。</p>
      </div>
      <div class="title-h2 title-color title-color-after">
        聽說可以使用情趣用品？
      </div>
      <div class="part">
        有些男生甚至會貼心地準備全新的情趣用品，細心挑選適合的款式，確保能讓妳更放鬆、更享受。如果妳有特別喜歡的玩具，也可以自己準備，讓這場體驗更加貼近自己的需求與喜好，小編超推薦可以帶小海螺吸吮器或者紅鶴跳蛋！在前戲讓男生操控絕對濕到不行
        還會叫很大聲</div>
    </div>

    <section class="section3" ref="section3">
      <div class="section3-content">
        <div class="tabs">
          <div class="tab">
            推薦
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
  margin: 60px auto 20px
  .title-h1
    font-size: 26px
    padding: 10px 0
    margin: 10px auto 20px
  .title-h2
    padding-top: 20px
    font-size: 24px
  .title-color
    color: #7c93b7
  .title-color-after
    padding-block-end: 30px
    position: relative
    &::after
      content: ''
      position: absolute
      left: 0
      bottom: 10px
      width: 25px
      border-bottom-width: 3px
      border-bottom-style: solid
      border-bottom-color: #baa38f
  .part
    font-size: 18px
    color: #5d5d5d
    margin:30px 0
    p
      margin: 15px
  img
    max-width: 100%
    width: 100%
    aspect-ratio: 6/3
    object-fit: cover
    margin: 40px 0

.section3
  transition: all .6s ease-in-out
  .section3-content
    position: relative
    max-width: 1170px
    margin: 0 auto
    padding: 60px 30px
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
