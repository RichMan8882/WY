<script lang="ts" setup>
const siteStore = useSiteStore()
const { queryChatbox } = siteStore
const { signin } = useAuthStore()
const passwordEyes = ref(false)
const recaptchaCode = ref('')
const recaptchaCheckFunction = ref(null)
const { t } = useI18n()
const scrollTop = ref(0)


import scroll1to1 from '@/assets/images/scroll-1.webp'
import scroll1to2 from '@/assets/images/scroll-2.webp'
import scroll1to3 from '@/assets/images/scroll-3.webp'
import scroll1to4 from '@/assets/images/scroll-4.webp'
import scroll1to5 from '@/assets/images/scroll-5.webp'
import scroll1to6 from '@/assets/images/scroll-6.webp'
const shopDetail = ref({
  id: 1,
  image: scroll1to1,
  image2: [scroll1to1, scroll1to2, scroll1to3, scroll1to4, scroll1to5, scroll1to6],
  title: "【WINYI】海后雙頭震動按摩棒(預購)",
  desc: `長天數預購商品❗️預計10月中到貨<br>訂單不拆單寄送，能接受者再下單🙏<br><br>3種花式玩法，讓妳盡情暢遊蜜道<br>超軟Q機身，雙頭置換加乘Double快感`,
  price: 355.74,
  oldPrice: 1755,
  stock: 50,
  activity: [`<a href="/promotions/6889ced66b68e600142e4153" target="_blank"><span>至<span local-datetime="" class="local-datetime" data-toggle="tooltip" data-placement="top" data-html="true" title="" data-original-title="依據你的當地時區顯示&lt;br/&gt;(GMT+8)">09/01 00:00</span>截止</span> 指定商品，浪漫七夕：玩具+項圈組合</a>`, `<a href="/promotions/6889ced66b68e600142e4153" target="_blank"><span>至<span local-datetime="" class="local-datetime" data-toggle="tooltip" data-placement="top" data-html="true" title="" data-original-title="依據你的當地時區顯示&lt;br/&gt;(GMT+8)">09/01 00:00</span>截止</span> 指定商品，浪漫七夕：玩具+項圈組合</a>`, `<a href="/promotions/6889ced66b68e600142e4153" target="_blank"><span>至<span local-datetime="" class="local-datetime" data-toggle="tooltip" data-placement="top" data-html="true" title="" data-original-title="依據你的當地時區顯示&lt;br/&gt;(GMT+8)">09/01 00:00</span>截止</span> 指定商品，浪漫七夕：玩具+項圈組合</a>`]
})

const showPassword = (type: boolean) => {
  passwordEyes.value = type
}


onMounted(async () => {
  if (window) {
    console.log('window', window.innerWidth)
    window.addEventListener('scroll', handleScroll)
  }

})

const openChatBox = () => {
  window.open(siteStore.chatbox, '_blank')
}

const handleScroll = () => {
  scrollTop.value = window.scrollY
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})

const selectMedia = (media?, scroll?) => {

}

import type { CarouselInstance } from 'element-plus'

const carousel = ref<CarouselInstance | null>(null)
//换成你自己的图片list我这里是直接填充了
const imgs = shopDetail.value.image2
const triggerOffsetY = ref(0)
const activeIndex = ref(0)

const handleChange = (current: number) => {
  //保存轮播索引
  activeIndex.value = current
  //索引大于等于5就触发缩略模块滑动
  if (current >= 4) {
    //5是缩略图最多可展示几张,48是通过缩略图的宽度和边距计算出,具体数值看自己需求
    triggerOffsetY.value = ((imgs.length - 4 - 1) * (72 + 10)) + 2
    //小于5回到初始位置
  } else if (current < 5) {
    triggerOffsetY.value = 0
  }
}
//点击缩略图同步轮播图索引
const setCarouselItem = (index: number) => {
  carousel.value?.setActiveItem(index)
}

const currentPreview = ref(null)
const showImageViewer = ref(false)

const onCurrentPreview = (item: any) => {
  currentPreview.value = item
  showImageViewer.value = true
}
const closeImgViewer = () => {
  showImageViewer.value = false
}

// 查看更多
const toggle = ref(false)


// 
const onAddToCart = () => {

}
const addItemQuantity = ref(1)
</script>

<template>
  <div class="cont" :style="{ overflowY: showImageViewer ? 'hidden' : 'auto' }">
    <headerTop :opaque="scrollTop >= 0"></headerTop>
    <div class="nav-lis">
      <div class="nav">
        <a href="/">全部商品 </a><span> / </span><a> 熱銷商品</a>
      </div>
    </div>
    <div class="cont-box">
      <div class="pd-box">
        <div class="product-info">
          <div class="inner inner-left">
            <div class="gallery">
              <div class="thumbs-container">
                <ul class="thumbs" :style="`transform: translateY(-${triggerOffsetY}px)`">
                  <li v-for="(url, index) in shopDetail.image2" :key="index" @click="setCarouselItem(index)"
                    :class="activeIndex === index ? 'active' : ''">
                    <img :src="url" />
                  </li>
                </ul>
              </div>
              <div class="carousel">
                <el-carousel ref="carousel" :v-model="1" trigger="click" indicator-position="none" :loop="false"
                  :autoplay="false" @change="handleChange">
                  <el-carousel-item v-for="item in shopDetail.image2" :key="item">
                    <img :src="item" @click="onCurrentPreview(item)" />
                  </el-carousel-item>
                </el-carousel>
                <el-image-viewer @close="closeImgViewer" :url-list="[currentPreview]" v-if="showImageViewer"
                  :hide-on-click-modal="true" :min-scale=".2" :max-scale="2" />
              </div>
              <div class="thumbs-container-mobi">
                <ul class="thumbs-mobi" :style="`transform: translateX(-${triggerOffsetY}px)`">
                  <li v-for="(url, index) in shopDetail.image2" :key="index" @click="setCarouselItem(index)"
                    :class="activeIndex === index ? 'active' : ''">
                    <img :src="url" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="inner inner-right">
            <div class="tabs">
              <div class="tab">
                商品描述
              </div>
            </div>
            <h1 class="product-title"> 【WINYI】海后雙頭震動按摩棒(預購) </h1>
            <p class="product-summary">
              長天數預購商品❗️預計10月中到貨<br>訂單不拆單寄送，能接受者再下單🙏<br><br>3種花式玩法，讓妳盡情暢遊蜜道<br>超軟Q機身，雙頭置換加乘Double快感</p>
            <hr>
            <div class="promotion-wrap">
              <div class="product-promotions" :style="{ maxHeight: toggle ? '999px' : '78px' }">
                <p class="product-promotions-tag"> <a href="/promotions/6889ced66b68e600142e4153"
                    target="_blank"><span>至<span class="local-datetime">09/01 00:00</span>截止</span>
                    指定商品，浪漫七夕：玩具+項圈組合</a> </p>
                <p class="product-promotions-tag"> [會員限定] <span>至<span class="local-datetime">09/01
                      00:00</span>截止</span> 全店，浪漫七夕：滿額贈好禮 </p>
                <p class="product-promotions-tag">
                  <span>
                    至
                    <span class="local-datetime">
                      09/01 00:00
                    </span>
                    截止
                  </span>
                  全店，浪漫七夕：$999免運(限台灣)
                </p>
              </div>
              <label class="toggle-label">
                <span class="toggle-off" @click="toggle = true" v-if="toggle == false">查看更多</span>
                <span class="toggle-on" @click="toggle = false" v-if="toggle == true">收起內容</span>
              </label>
            </div>
            <div class="product-detail">
              <div class="price-box">
                <div class="price">HK$355.74</div>
                <div class="old-price">HK$560.48</div>
              </div>
              <div class="product-review-box">
                <span class="review-summary-info-stars"><span class="fa fa-star"></span>
                  <span class="fa fa-star"></span>
                  <span class="fa fa-star"></span>
                  <span class="fa fa-star"></span>
                  <span class="fa fa-star"></span>
                </span>
                <span class="review-summary-data">
                  5.0 分 |
                  <a class="binding">
                    <!-- @click="scrollToProductReviews()" -->
                    1 個評價
                  </a>
                </span>
              </div>

              <div v-show="false" class="txt-preorder">
                <span>長天數預購商品，預計10月中到貨</span>
              </div>
              <div class="select-quantity" v-if="shopDetail.stock > 0">
                <div class="quantity-title">
                  數量
                </div>
                <div class="quantity">
                  <div class="quantity-btn">
                    <span class="reduce-quantity-btn" @click="addItemQuantity--">
                      <button type="button" class="btn btn-default">
                        <i class="fa fa-minus"></i>
                      </button>
                    </span>
                    <input class="quantity-input" type="text" maxlength="5" v-model="addItemQuantity">
                    <span class="add-quantity-btn" @click="addItemQuantity++">
                      <button type="button" class="btn btn-default">
                        <i class="fa fa-plus"></i>
                      </button>
                    </span>
                  </div>
                  <div class="has-buy-now-button">
                    <button class="shop-car ladda-button" @click="onAddToCart(true)">
                      <span class="fa fa-shopping-cart"></span>
                      <span class="ladda-label ">加入購物車</span>
                    </button>
                    <button class="buy ladda-button">
                      <i class="fa-solid fa-bag-shopping"></i>
                      立即購買
                    </button>
                  </div>
                  <div class="buy-now" v-show="false">
                    <span class="">商品預購中</span>
                  </div>
                </div>
              </div>
              <div class="txt-notify" v-show="addItemQuantity > 99999">
                <div class="out-of-stock">一次最大商品購買數量限制為 99999</div>
              </div>
              <div class="txt-notify" v-show="isNaN(addItemQuantity)">
                <div class="out-of-stock">該數量不適用，請填入有效的數量。</div>
              </div>
              <div class="txt-notify" v-show="shopDetail.stock <= 0">
                <div class="out-of-stock txt-sold-out">售完</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footerBottom />
  </div>
</template>

<style scoped lang="sass">
.cont
  padding-block-start: 147.5px
  height: 100dvh
  overflow-y: auto
  .nav-lis
    background: #f5f5f5
    .nav
      display: flex
      align-items: center
      width: 1400px
      max-width: 100%
      margin: 0 auto
      padding: 10px 20px
      span
        padding: 0 4px
      a
        color: #999
        font-size: 13px
        &:hover
          color: #333
  .cont-box
    width: 1400px
    max-width: 100%
    margin: 0 auto
    padding: 10px 20px
    .pd-box
      padding: 15px 20px
      .product-info
        width: 990px
        max-width: 100%
        padding-top: 30px
        margin: 0 auto
        // display: flex
        .inner
          flex: 1
          // width: 50%
          .tabs
            display: flex
            justify-content: center
            margin-block: 20px
            .tab
              color: #5d5d5d
              font-size: 18px
              position: relative
              padding-block-end: 2px
              &::after
                content: ''
                position: absolute
                bottom: 0
                left: 50%
                transform: translateX(-50%)
                height: 2px
                width: 33.33333%
                background: #baa38f
                
        .inner-left
          // padding: 0 20px 20px 15px
          padding: 0 15px 15px
          min-width: 550px
        .inner-right
          // padding: 0 15px 20px 20px
          max-width: 720px
          margin: 0 auto
          color: #5d5d5d
          h1.product-title
            font-size: 18px
            line-height: 36px
            margin-bottom: 20px
          .product-summary
            font-size: 14px
            margin-bottom: 14px
          hr
            margin-top: 0
          .promotion-wrap
            padding-top: 20px
            padding-bottom: 20px
            .product-promotions
              max-height: 78px
              overflow-y: auto
              .product-promotions-tag
                border-inline-start: 3px solid #baa38f
                font-size: 14px
                line-height: 26px
                padding: 0 5px
            .toggle-label
              width: 100%
              display: flex

            .toggle-off,.toggle-on
              display: inline-block
              margin: 20px auto 0
              color: #aaa
              border: 1px solid #eee
              border-radius: 4px
              cursor: pointer
              font-size: 14px
              padding: 0 10px
              line-height: 24px
              font-weight: normal
          .product-detail
            .price-box
              display: flex
              align-items: center
              font-weight: bold
              .price
                color: #baa38f
                font-size: 20px
              .old-price
                color: #80808099
                font-size: 17px
            .product-review-box
              margin-right: 20px
              .svg-inline--fa
                color: #ffc500
                padding-right: 5px
            .review-summary-data
              font-size: 17px
              color: #80808099
              .binding
                color: #5d5d5d
            .txt-preorder
              padding: 6px 9px
              margin: 10px 0
              font-size: 14px
              color: #ffffff
              background: #5d5d5d
              display: inline-block
              border-radius: 4px
            .select-quantity
              .quantity-title
                font-size: 13px
              .quantity
                margin-block-end: 10px
                .quantity-btn
                  display: flex
                  width: 100% !important
                  margin-bottom: 10px
                  display: flex
                  align-items: center
                  .add-quantity-btn,.reduce-quantity-btn
                    
                    width: 36px
                    height: 36px
                    padding: 6px 12px
                    border: 1px solid #e5e5e5
                  .quantity-input
                    flex: 1
                    height: 36px
                    border-block: 1px solid #e5e5e5
                    text-align: center
                    .btn-default
                      i.fa
                        width: 18px
                        height: 18px
                .has-buy-now-button
                  display: grid
                  grid-template-columns: repeat(2, 1fr)
                  gap: 10px
                  padding: 0 80px
                  margin: 40px 0 10px
                  .ladda-button
                    font-size: 14px
                    color: #ffffff
                    background: #baa38f
                    border: 1px solid  #baa38f
                    text-align: center
                    padding: 6px 12px
                    line-height: 24px
                    border-radius: 4px
                    &:hover
                      color: #baa38f
                      background: #ffffff
              .buy-now
                font-size: 14px
                text-align: center
            .txt-notify
              font-size: 12px
              color: #765a6a
</style>

<style scoped lang="scss">
.gallery {
  width: 100%;
  overflow: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .carousel {
    width: calc(100% - 100px);
    height: 415px;
    overflow: hidden;

    .el-carousel {
      height: 100% !important;

      :deep(.el-carousel__container) {
        height: 100% !important;
      }
    }


  }

  .el-carousel__arrow {
    width: 24px;
    height: 36px;
    border-radius: 12px;
  }

  .el-carousel__item {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .thumbs-container-mobi {
    display: none;
  }

  .thumbs-container {
    max-height: 400px;
    overflow: hidden;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2), rgba(0, 0, 0, .5));
      height: 20px;
    }

    &::before {
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2), rgba(0, 0, 0, .5));
      height: 20px;
    }
  }

  .thumbs {
    overflow: hidden;
    zoom: 1;
    width: 72px;
    transition: all 0.5s;
    padding: 1px 0;

    li {
      width: 72px;
      height: 72px;
      overflow: hidden;
      cursor: pointer;
      margin-bottom: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.active {
        border: 2px solid #baa38f;
      }
    }
  }
}

@media (max-width: 768px) {
  .cont {
    padding-block-start: 110px
  }

  .pd-box {
    padding: 0 !important;
  }

  .product-info {
    padding-top: 0 !important;

    .inner-left {
      padding: 0 !important;
      width: 100%;
      min-width: 100% !important;
    }
  }


  .gallery {
    display: block;

    .carousel {
      width: 100%;

      .el-carousel {
        .el-carousel__item {
          img {
            object-fit: cover;
          }
        }
      }
    }

    .thumbs-container {
      display: none;
    }
  }

  // 手機版
  .thumbs-container-mobi {
    display: block !important;
    max-height: 72px;
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: 10px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      top: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2), rgba(0, 0, 0, .5));
      height: 20px;
    }

    &::before {
      content: '';
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2), rgba(0, 0, 0, .5));
      height: 20px;
    }
  }

  .thumbs-mobi {
    zoom: 1;
    width: 60px;
    transition: all 0.5s;
    padding: 0 1px;
    display: flex;

    li {
      min-width: 60px;
      width: 60px;
      height: 60px;
      overflow: hidden;
      display: inline-block;
      cursor: pointer;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.active {
        border: 2px solid #baa38f;
      }
    }
  }

  .has-buy-now-button {
    padding: 0 !important;
  }
}
</style>
