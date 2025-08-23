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
    title: '情趣用品清潔指南',
    image: article3,
    id: 2,
    introduction: '常常遇到客人詢問情趣用品清潔相關問題，小編特別幫大家整理情趣用品防水等級、清洗等注意事項給大家～讓你不在擔心錯誤的使用習慣導致玩具壽命縮短！',
    link: '/',
    time: '2025-07-05'
  },
  {
    title: '情趣用品能帶出國嗎？帶你了解',
    image: article2,
    id: 3,
    introduction: '小編常常遇到 ig粉絲詢問想帶情趣玩具出國，但要放手提行李還是托運呢？這篇就來幫大家好好分析情趣玩具到底該怎麼放，以及推薦幾款帶出國不容易造成尷尬的情趣玩具！',
    link: '/',
    time: '2025-07-05'
  },
  {
    title: '情趣用品清潔指南',
    image: article3,
    id: 4,
    introduction: '常常遇到客人詢問情趣用品清潔相關問題，小編特別幫大家整理情趣用品防水等級、清洗等注意事項給大家～讓你不在擔心錯誤的使用習慣導致玩具壽命縮短！',
    link: '/',
    time: '2025-07-05'
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
  { name: '精選文章', id: 'jxwz' },
  { name: '玩具指南', id: 'wjzn' },
  { name: '床上性事', id: 'csxs' },
  { name: '好片推薦', id: 'hptj' },
  { name: '兩性攻略', id: 'lxgl' },
  { name: '私密護理', id: 'smhl' },
])

// 目前分類
const currentCategory = ref('jxwz')

const onCurrentCate = (cate: any) => {
  currentCategory.value = cate
}

</script>

<template>
  <div class="cont">
    <headerTop :opaque="scrollTop >= 0" :timer="timer"></headerTop>
    <div class="index-bg">
      <div class="index-bg-content">
        <div class="tabs">
          <div class="tab">
            W專欄
          </div>
        </div>
        <p>
          從線上到線下，從床上到床下，在這裡我們談情趣，但不情色。
        </p>
      </div>
    </div>

    <div class="content-nav">
      <div class="navs">
        <div class="nav" @click="onCurrentCate(item.id)" :class="currentCategory === item.id ? 'nav-active' : ''"
          v-for="item in categorys" :key="item.id">
          {{ item.name }}
        </div>
      </div>
    </div>
    <section class="section3" ref="section3">
      <div class="section3-content">

        <div class="section3-content-cont" ref="container">
          <div class="section3-cont-item" v-for="(item, index) in article" :key="index">
            <div class="article-item">
              <div class="item-content">
                <img alt="article-img" :src="item.image" style="width:100%">
                <div class="container">
                  <p
                    style="margin-bottom: 0px; line-height: 1.5; padding: 0px; background-color: rgb(255, 255, 255); text-align: left;">
                    <a @click="navigateTo('/articledetails')">
                      <span>
                        <span style="font-size:26px;color:#428BCA;">
                          <strong>2025 陰蒂吸吮器！體驗高潮就靠吸吮器</strong>
                        </span>
                      </span>
                    </a>
                  </p>
                  <p
                    style="margin-bottom: 0px; line-height: 1.5; padding: 0px; background-color: rgb(255, 255, 255); text-align: left;">
                    &nbsp;</p>

                  <p
                    style="margin-bottom: 0px; line-height: 1.5; padding: 0px; background-color: rgb(255, 255, 255); text-align: left;">
                    <span
                      style="color: rgb(0, 0, 0); font-size: 18px;">第一次買情趣用品該從哪款情趣用品下手呢？以下會為跟大家介紹幾款千元有找的吸吮器，從最初階到進階款都有，保證讓妳試過一次就回不去用手手了！</span>
                    <a @click="navigateTo('/articledetails')">
                      <span style="font-size:18px;color:#428BCA;">(繼續閱讀)</span></a>
                  </p>
                </div>
              </div>
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
    width: 1200px
    margin: 0 auto 30px
    p
      text-align: center
      font-weight: 600
.content-nav
  padding: 0 10px
  max-width: 100%
  width: 1170px
  margin: 20px auto 0
  .navs
    min-height: 52px
    display: flex
    justify-content: center
    flex-wrap: wrap
    background: #ede2d1
    gap: 10px
    .nav
      color: #615346
      max-width: 25%
      min-width: 50px
      width: 100px
      padding: 0 10px
      height: 100%
      line-height: 52px
      text-align: center
      &:hover
        background: #dbc2ab
    .nav-active   
      background: #dfae7d !important
.tabs
  display: flex
  justify-content: center
  margin-block: 0 30px
  .tab
    color: #535353
    font-weight: 600
    font-size: 36px
    position: relative
    padding-block: 10px 15px
    &::after
      content: ''
      position: absolute
      bottom: 0
      left: 50%
      transform: translateX(-50%)
      height: 3px
      width: 25%
      background: #baa38f
.section3
  transition: all .6s ease-in-out
  .section3-content
    position: relative
    max-width: 1170px
    margin: 0 auto
    padding: 50px 15px 30px
    
    .section3-content-cont
      display: grid
      grid-template-columns: repeat(3, 1fr)
      gap: 30px
      cursor: grab
      .section3-cont-item
        min-width: calc(25% - 12px)
        display: flex
        flex-direction: column
        align-items: center
        // justify-content: center
        .article-item
          .article-img
            width: 100%
          .item-content
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
            .container
              padding: 40px


@media (max-width: 1200px)
  .section3-content-cont
    grid-template-columns: repeat(2, 1fr) !important
    gap: 20px
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
    padding: 30px 15px !important
  .section3-content-cont
    grid-template-columns: repeat(1, 1fr) !important
    gap: 10px
    h4
      white-space: nowrap

</style>
