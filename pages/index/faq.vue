<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
const { t } = useI18n()
const router = useRouter()
const scrollTop = ref(0)
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section3 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)
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
  let scrollTrue = scrollTop.value + windowHeight.value
  console.log('offsetTop', section1.value?.offsetTop)
  console.log('scrollTop', window.scrollY)
  console.log('scrollTrue', scrollTrue)

  console.log(scrollTrue >= section1.value?.offsetTop - 100)
  if (scrollTrue >= section3.value?.offsetTop - 100) {
    section3.value?.classList.add('section-attain')
  } else {
    section3.value?.classList.remove('section-attain')
  }
  if (scrollTrue >= section4.value?.offsetTop - 100) {
    section4.value?.classList.add('section-scale')
  } else {
    section4.value?.classList.remove('section-scale')
  }
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})

const aqList = [
  {
    title: 'Q1：情趣用品拆封體驗後覺得玩具尺寸不對、用起來不順手、不喜歡，請問可以退貨退款嗎？',
    content: ['情趣用品屬例外商品類別：「已拆封之個人衛生用品」，故不適用7天鑑賞期法規，退貨退款須包裝完整(封膜未拆封)，切勿拆封使用後以不符合期待之相關原因要求退貨退款。']
  },
  {
    title: 'Q2：請問小編可以寄到國外嗎？',
    content: ['A：大部分的國家都可以呦。 除了泰國、杜拜、阿拉伯、印度、越南、馬爾地夫! 但是海外的話就要先信用卡付款! 如果不確定自己的居住地有沒有送到的話，可以私訊小編詢問。']
  },
  {
    title: 'Q3：請問下單後，多久會出貨？運送的包裝上會有情趣字樣嗎？',
    content: ['A：全館都是下單1-3天出貨，國定假日不出貨！ (特殊節日訂單較多時請見諒) 我們運送包裝都是用素色破壞袋寄送，外面不會有任何情趣字樣，請安心購買！', ' *【超商取貨】交貨便上廠商名稱顯示為WINYI，介意者請改宅配下單']
  },
  {
    title: 'Q4：剛購買的商品無法正常使用，遇到開不了機、充不飽電、充電不會閃爍...等等的問題怎麼辦?',
    content: ['A：可以私訊WINYI的賴客服(@852vijlb) 敘述商品問題並提供購買證明，WINYI的產品售後都有一年的非人為因素保固。']
  },
  {
    title: 'Q5：WINYI 的客服通常都是什麼時候會回覆訊息？',
    content: ['A：客服回覆時間平日9:30~18:30，六日&國定假日可能會晚回覆，敬請見諒。5']
  },
  {
    title: 'Q6：WINYI 有哪些購買通路？',
    content: ['A：WINYI 購買通路可參考 https://www.winyi.tw/pages/path']
  },
  {
    title: 'Q7：如果情趣玩具的充電線弄丟了，可以單買充電線嗎？',
    content: ['A：可以的！可以私訊LINE 客服，並告知客服欲購買的商品充電線。', '*充電線$150／郵局運費$30，共會跟您收$180']
  },
  {
    title: 'Q8：新會員＆生日購物金如何領取、使用？',
    content: ['A：先註冊官網會員，消費滿$1200即可使用新會員購物金，生日購物金會在生日當天發送，最晚需在生日前一天註冊才會收到(與新會員購物金不可併用)']
  },
  {
    title: 'Q9：如果是初學者的話，推薦使用什麼樣的產品？',
    content: ['A：吸吮器系列的都很適合初學者。 如果想嘗試進入型的初學者，可以試試「森之妖精、小黑鵝」。']
  },
  {
    title: 'Q10：請問聰明球該如何使用？',
    content: ['A：可以參考以下影片＆專欄文章 https://www.winyi.tw/pages/smart-ball']
  },

]

const aq = ref(0)
const onAq = (index: number) => {
  aq.value = index
}

</script>

<template>
  <div class="cont">
    <headerTop opaque></headerTop>
    <div class="index-bg">
      <div class="bnr">
        <img src="@/assets/images/faq.webp" alt=""></img>
      </div>
      <div class="bnr-text">
        <h2>退換貨政策</h2>
        <br />
        <h4>無七天鑑賞期</h4>
        <p>情趣用品屬個人私密衛生商品，不適用於消保法規範，下標後即認同購買，無七天鑑賞期，也因難以辨識使用與否，基於衛生安全問題，售出拆封後恕不接受商品退換貨，但新品享有故障「換貨」服務。</p>
        <br />
        <h4>保固與退換貨流程</h4>
        <p>WINYI系列商品享一年非人為因素保固，如需進行保固服務，或是購買的新品瑕疵故障導致無法正常使用，需進行換貨，請聯繫WINYI官方LINE帳號：@630hrrid，並提供商品購買截圖證明，將由客服人員協助您做處理。
        </p>

        <br />
        <p> 若<strong>新品</strong>(收到7日內)欲進行<strong>退貨</strong> ，將以宅配方式收回商品，我方收到商品確認包裝無損後於7日內進行退款、重開發票(運費我方負擔)</p>

        <p>若<strong>新品</strong>(收到7日內)瑕疵進行<strong>保固服務</strong> ，將以宅配來回件方式處理(來回運費我方負擔)，若不方便寄宅配可改以7-11超商寄送(運費我方負擔)</p>

        <p>若<strong>舊品</strong>(1年保固期內)故障進行<strong>保固服務</strong> ，需請您自行寄送商品，我方收到商品後確認商品有問題將寄送未拆封新品給您(運費雙方各負擔一趟)</p>

        <p>*若購買渠道非透過WINYI官網或WINYI合作通路(網路經銷商、實體門市)購買，恕不提供保固服務</p>
      </div>
    </div>
    <!-- 常见问题 -->
    <section class="package-bg3">
      <div class="pgCon">
        <div class="problem">
          <div class="problem-tit">
            <h3>Q & A</h3>
          </div>
          <div class="problem-con">
            <div class="cell" v-for="(item, index) in aqList" @click="onAq(index)"
              :class="aq == index ? 'cell-active' : ''">
              <div class="cell-btn">
                <div>{{ item.title }}</div>
                <div>
                  <img src="@/assets/images/plus.png" alt="" class="rig-pbm">
                </div>
              </div>
              <div class="cell-con">
                <p v-for="value in item.content">
                  {{ value }}
                </p>
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
.index-bg
  width: 1170px
  max-width: 100%
  padding-bottom: 40px
  padding-top: 40px
  margin: 0 auto
  adding: 30px 15px
  .bnr
    padding: 15px
    img
      width: 100%
  .bnr-text
    padding: 40px 15px 15px
    color: #585858
    h2
      font-size: 24px
      font-weight: 700
      margin-bottom: 25px
      text-align: center
    h4
      font-size: 18px
      margin-bottom: 10px
      font-weight: 700
    p
      font-size: 16px
      margin-bottom: 5px
    strong
      font-weight: 700

  

/* 常见问题 */
.package-bg3 
    width: 100%
    // background: #F8F9FB
.package-bg3 .problem 
    padding: 60px 0


.problem .problem-tit h3 
    text-align: center
    // font-weight: bold
    font-size: 26px
    color: #333333
    line-height: 56px


.problem .problem-con
    max-width: 100%
    margin: 0 auto
    width: 1170px
    padding: 0 20px

.problem .problem-con .cell 
    // border-bottom: 1px solid #F3F4F5
    cursor: pointer

.problem .problem-con .cell .cell-btn 
    padding: 20px 0
    display: flex
    align-items: center
    justify-content: space-between
    font-weight: 400
    font-size: 16px
    color: #333333
    line-height: 22px
    cursor: pointer

.problem-con .cell .cell-con 
    overflow-y: scroll
    scrollbar-width: none
    max-height: 0
    transition: all 0.3s ease-out



.problem-con .cell .cell-con p 
    font-weight: 400
    font-size: 14px
    color: #808080
    line-height: 30px
    padding-bottom: 18px


.problem-con .cell-active .cell-btn 
    color: #333 !important



.problem-con .cell-btn .rig-pbm
    display: block
    max-width: 14px
    max-height: 14px


.problem-con .cell-active .cell-con 
    max-height: 300px

.cell .cell-btn .rig-pbm
    transform: rotateZ(0)
    transition: all 0.3s ease-out

.problem-con .cell-active .cell-btn .rig-pbm
    transform: rotateZ(-225deg)


</style>
