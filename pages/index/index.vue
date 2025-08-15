<script lang="ts" setup>
import { ref, onMounted, onUnmounted  } from 'vue'
const { t } = useI18n()
const siteStore = useSiteStore()
const router = useRouter()
const scrollTop = ref(0)
const section1 = ref<HTMLElement | null>(null);
const section2 = ref<HTMLElement | null>(null);
const section3 = ref<HTMLElement | null>(null);
const section4 = ref<HTMLElement | null>(null);
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
  console.log('offsetTop',section1.value?.offsetTop);
  console.log('scrollTop', window.scrollY)
  console.log('scrollTrue', scrollTrue);
  
  console.log(scrollTrue >= section1.value?.offsetTop - 100);
  
  if (scrollTrue >= section1.value?.offsetTop - 100) {
    section1.value?.classList.add("section-attain");
  } else {
    section1.value?.classList.remove("section-attain");
  }
  if (scrollTrue >= section2.value?.offsetTop - 100) {
    section2.value?.classList.add("section-scale");
  } else {
    section2.value?.classList.remove("section-scale");
  }
  if (scrollTrue >= section3.value?.offsetTop - 100) {
    section3.value?.classList.add("section-attain");
  } else {
    section3.value?.classList.remove("section-attain");
  }
  if (scrollTrue >= section4.value?.offsetTop - 100) {
    section4.value?.classList.add("section-scale");
  } else {
    section4.value?.classList.remove("section-scale");
  }
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="cont">
    <headerTop :opaque="scrollTop > 10"></headerTop>
    <div class="index-bg">
      <div class="index-bg-content">
        <div class="content-left">
          <div class="left-cont">
            紅杉資本（ Sequoia Capital ）創始於 1972 年，共有 18
            只基金，擁有超過 40 億美元總管理資本。總共投資超過 500 家公司， 200
            多家成功上市， 100 多個通過兼併收購成功退出。 紅杉資本作為全球最大的
            VC( 風險投資商 ) ，曾投資了蘋果電腦、思科、甲骨文、雅虎和 Google 、
            Paypal
            等一批著名科技公司，一度造就長達三十餘年美國多家著名企業圍繞紅杉資本而建立的紅杉現象。目前其投資的公司總市值超過納斯達克市場總價值的
            10% 。 美國高科技企業多集中在加州，該公司曾宣稱投資從不超過矽谷
            40英里半徑。
          </div>
          <div class="left-button">
            <div class="button" @click="navigateTo('/service')">
              {{ t('我們的服務') }}
            </div>
            <a class="button button2" :href="siteStore.chatbox" target="_blank">
              {{ t('聯絡我們') }}
            </a>
          </div>
        </div>
        <div class="content-right">
          <img src="@/assets/images/slider-img.png" alt=""></img>
        </div>
      </div>
    </div>
    <section class="section1" ref="section1">
      <div class="section1-content">
        <div class="section1-item item1">
          <div class="section1-item-content">
            <svg t="1746169862848" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4805"><path d="M182.09431211 459.80684449a32.95761117 32.95761117 0 0 0-32.79282268-33.22127196c-18.09372848 0-32.75986577 14.9957127-32.75986576 33.22127196v416.91378065C116.50866597 895.14392982 131.10888784 909.9748548 149.46627714 909.9748548c18.19260157 0 32.95761117-14.9957127 32.92465347-33.22127197l-0.32957543-416.91378064zM314.91348537 844.05963246h439.55565972c5.33913299 0 14.00698488-7.01997091 15.06162809-12.19431618l69.57351743-333.46510912c6.26194619-30.05734156-9.5247497-49.43641637-40.50490445-49.37050175h-15.55599201c-14.89684038 0.0659154-29.99142618 0.0659154-44.16319876 0.06591539-23.82835307 0-41.85616617-0.09887309-52.07302595-0.2307031l-95.9725639-1.45013481 35.79196615-89.05146531c11.10671528-27.65143587 17.3686607-56.52230344 17.3686607-85.03063712 0-62.12509724-26.16834337-88.45822833-54.11639697-88.12865212-21.38948968 0.2636608-33.94633976 12.29318928-33.78155205 45.31671507-3.69125278 132.16002088-101.9049339 249.95052297-241.18379799 261.41977214V844.05963246zM687.79589804 382.94969536l70.03492364 0.2307031c22.24638748 0 40.57081907-0.0659154 40.57081907-0.06591538 72.96815094-0.09887309 120.064577 57.74173436 105.23365279 128.76538659l-69.54055972 333.46510988C826.58039823 881.03807262 791.01913595 909.9748548 754.43618739 909.9748548H282.18657732a33.28718737 33.28718737 0 0 1-33.18831428-33.18831427V460.10346299c0-18.3244316 14.76500959-33.18831427 33.02352655-33.18831428h10.54643521c124.28315139 0 195.10905821-106.15646522 197.64679392-198.24003169-0.46140621-75.34109894 49.93078104-108.82603172 98.87283351-109.41926872 48.97501016-0.593237 120.82260249 39.21955736 120.8226025 154.04387447 0 15.16050119-1.31830478 29.82663847-3.6253374 43.83362257l-18.48921929 65.78339232z" p-id="4806"></path></svg>
            <div class="section1-item-text">
              {{ t('1180699+') }}
            </div>
            <div class="section1-item-title">
              {{ t('滿意的客戶') }}
            </div>
          </div>
        </div>
        <div class="section1-item item2">
          <div class="section1-item-content">
            <svg t="1746169653328" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4881"><path d="M1024 810.4l-108.9-0.1v-0.1c-1 0.1-2 0.2-3 0.2-16.5-0.2-29.9-13.6-30-30.1-0.1-16.5 13.1-30.1 29.6-30.4h47.8c-19-96.5-78.4-161.5-162.2-200.1-14.6-5.1-25.1-18-27.1-33.4-2-15.4 4.9-30.5 17.8-39.2v-0.2c39.1-33.1 61.6-81.7 61.5-132.9 0-96.4-78.3-174.6-175-174.6-1.4 0-2.9 0-4.3 0.1l-0.1-0.1H669c-16.7 0-30.3-13.6-30.3-30.3 0-16.7 13.5-30.3 30.3-30.3h1.6l-0.3-0.3c1.4 0 2.7-0.1 4.1-0.1C804.5 108.6 910 214 910 344a234.3 234.3 0 0 1-70.7 168.1c107.5 57.3 180.4 169.2 184.7 298.3zM748 449.3a234.3 234.3 0 0 1-70.7 168.1c107.5 57.3 181.7 168.8 185.9 298H161.7c4.3-129.2 78.4-240.7 185.9-298a234.3 234.3 0 0 1-70.7-168.1c0-130 105.4-235.4 235.5-235.4S748 319.3 748 449.3zM227.4 855.2h570c-19.2-97.9-80.1-163.5-166-201.9-34.7 21.5-73.6 31.4-119 31.4-45.3 0-85.2-9.9-119.9-31.4-85.8 38.4-145.8 104-165.1 201.9z m285.1-580.4c-96.6 0-175 78.2-175 174.6 0 96.4 78.3 174.6 175 174.6s175-78.2 175-174.6c0-96.4-78.3-174.6-175-174.6zM355 169.8h-1.1l-0.1 0.1c-1.4 0-2.9-0.1-4.3-0.1-96.6 0-175 78.1-175 174.5 0 51.2 22.5 99.8 61.5 132.9v0.2c12.9 8.6 19.8 23.8 17.8 39.1-2 15.4-12.5 28.3-27.1 33.4-83.9 38.6-143.3 103.6-162.2 200h47.7c16.7 0.1 30.2 13.7 30.1 30.4-0.1 16.7-13.7 30.2-30.4 30.1-1 0-2-0.1-3-0.2v0.1L0 810.4c4.3-129.1 77.2-240.9 184.7-298.2A234.3 234.3 0 0 1 114 344.1c0-130 105.4-235.3 235.5-235.3 1.4 0 2.7 0 4.1 0.1l-0.3 0.3h1.6c10.9-0.1 20.9 5.7 26.3 15.1 5.4 9.4 5.4 21 0 30.4-5.3 9.4-15.3 15.1-26.2 15.1z m0 0" p-id="4882"></path></svg>
            <div class="section1-item-text">
              {{ t('875k+') }}
            </div>
            <div class="section1-item-title">
              {{ t('目前的用戶') }}
            </div>
          </div>
        </div>
        <div class="section1-item item3">
          <div class="section1-item-content">
            <svg t="1746170080295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4957" ><path d="M332.43465925 145.20508675A61.50608735 61.50608735 0 0 0 270.92857107 206.71117408V430.10768434c0 133.13717551 107.93425342 241.07142893 241.07142893 241.07142811s241.07142893-107.93425342 241.07142893-241.07142811V206.71117408C753.07142893 172.74201827 725.53449658 145.20508675 691.56534075 145.20508675H332.43465925z m466.26501626 394.39285703C758.35308475 645.20914497 661.35470803 722.79031365 544.87337671 735.20549258V747.88365782h109.57792209c72.61728937 0 131.49350684 58.87621747 131.49350601 131.49350684a43.83116867 43.83116867 0 0 1-43.83116868 43.83116867H281.88636387a43.83116867 43.83116867 0 0 1-43.83116868-43.83116867c0-72.61728937 58.87621747-131.49350684 131.49350601-131.49350684h109.57792209v-12.70008133C362.64529197 722.79031365 265.64691525 645.20914497 225.30032449 539.59794378 159.3125 537.23106023 106.56168836 482.97903111 106.56168836 416.41044378V254.78300884a65.74675342 65.74675342 0 0 1 65.74675341-65.74675342h34.08969095c8.60186728-61.9115257 61.75811728-109.57792209 126.03652653-109.57792209h359.13068151c64.27840925 0 117.43465924 47.66639639 126.03652652 109.57792209H851.69155823a65.74675342 65.74675342 0 0 1 65.74675341 65.74675342v161.62743494c0 66.56858734-52.75081164 120.80965924-118.73863613 123.1875zM818.81818152 254.78300884v213.62215924a57.52840924 57.52840924 0 0 0 32.87337671-51.9947243V254.78300884h-32.87337671zM172.30844177 254.78300884v161.62743494a57.52840924 57.52840924 0 0 0 32.87337671 51.9947243V254.78300884H172.30844177z m306.81818152 76.70454538a32.87337671 32.87337671 0 1 1 65.74675342 0v153.40909075a32.87337671 32.87337671 0 1 1-65.74675342 0V331.48755422zM307.53855481 857.46157991H716.4724024A65.77962671 65.77962671 0 0 0 654.4512988 813.63041124H369.5487012a65.77962671 65.77962671 0 0 0-62.01014639 43.83116867z" p-id="4958"></path></svg>
            <div class="section1-item-text">
              {{ t('108+') }}
            </div>
            <div class="section1-item-title">
              {{ t('得獎') }}
            </div>
          </div>
        </div>
        <div class="section1-item item4">
          <div class="section1-item-content">
            <svg t="1746170283713" class="icon" viewBox="0 0 1308 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4957"><path d="M687.261158 991.025182a62.256456 62.256456 0 0 1-59.354673-44.450055L435.597347 302.840729 344.784698 579.301604a61.860759 61.860759 0 0 1-58.893025 42.471565H93.120886a62.124557 62.124557 0 0 1 0-124.117215h147.727185l139.219682-422.20957A64.366845 64.366845 0 0 1 440.213821 32.974818a62.981902 62.981902 0 0 1 58.827076 44.450055l189.473304 636.611837L832.284408 244.013654a61.926708 61.926708 0 0 1 116.137309-6.133317l108.487151 260.171315h153.596703a62.124557 62.124557 0 1 1 0 124.117215h-194.749276a62.981902 62.981902 0 0 1-57.508082-37.921041l-58.761126-139.087782-153.596703 502.536227a62.586205 62.586205 0 0 1-58.893025 43.065112z m0 0"  p-id="4958"></path></svg>
            <div class="section1-item-text">
              {{ t('12000+') }}
            </div>
            <div class="section1-item-title">
              {{ t('用戶評價') }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section2" ref="section2">
      <div class="section2-content">
        <div class="section2-content-left">
          <img src="@/assets/images/about-img.png" alt="">
        </div>
        <div class="section2-content-right">
          <div class="section2-content-right-title">
            {{ '紅杉資本中國基金作為“創業者背後的創業者”' }}
          </div>
          <div class="section2-content-right-text">
            <p>紅杉資本由唐·瓦倫丁（Don Valentine）於1972年在加州門洛帕克創立。在1990年代中期，瓦倫丁將公司的控制權交給了Doug Leone和Michael Moritz。</p>
            <h4><svg t="1746177336687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7213" width="16" height="16"><path d="M887.466667 217.6c-21.333333-12.8-64 34.133333-64 34.133333l-422.4 392.533334L213.333333 477.866667s-51.2-21.333333-38.4 51.2L384 802.133333s12.8 17.066667 38.4 0c25.6-17.066667 460.8-533.333333 460.8-533.333333s25.6-38.4 4.266667-51.2z" fill="#7354FF" p-id="7214"></path></svg> 1999年，紅杉資本將業務擴展到以色列。</h4>
            <h4><svg t="1746177336687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7213" width="16" height="16"><path d="M887.466667 217.6c-21.333333-12.8-64 34.133333-64 34.133333l-422.4 392.533334L213.333333 477.866667s-51.2-21.333333-38.4 51.2L384 802.133333s12.8 17.066667 38.4 0c25.6-17.066667 460.8-533.333333 460.8-533.333333s25.6-38.4 4.266667-51.2z" fill="#7354FF" p-id="7214"></path></svg> 紅杉資本中國成立於2005年，是美國公司的附屬公司。該公司是由沈南鵬領導的。</h4>
            <h4><svg t="1746177336687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7213" width="16" height="16"><path d="M887.466667 217.6c-21.333333-12.8-64 34.133333-64 34.133333l-422.4 392.533334L213.333333 477.866667s-51.2-21.333333-38.4 51.2L384 802.133333s12.8 17.066667 38.4 0c25.6-17.066667 460.8-533.333333 460.8-533.333333s25.6-38.4 4.266667-51.2z" fill="#7354FF" p-id="7214"></path></svg> 2006年，紅杉資本收購了印度創投公司Westbridge Capital Partners。後來改名為紅杉資本印度公司</h4>
            <h4><svg t="1746177336687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7213" width="16" height="16"><path d="M887.466667 217.6c-21.333333-12.8-64 34.133333-64 34.133333l-422.4 392.533334L213.333333 477.866667s-51.2-21.333333-38.4 51.2L384 802.133333s12.8 17.066667 38.4 0c25.6-17.066667 460.8-533.333333 460.8-533.333333s25.6-38.4 4.266667-51.2z" fill="#7354FF" p-id="7214"></path></svg> CB Insights認可紅杉資本（Sequoia Capital）為2013年排名第一的創投公司。</h4>
            <h4><svg t="1746177336687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7213" width="16" height="16"><path d="M887.466667 217.6c-21.333333-12.8-64 34.133333-64 34.133333l-422.4 392.533334L213.333333 477.866667s-51.2-21.333333-38.4 51.2L384 802.133333s12.8 17.066667 38.4 0c25.6-17.066667 460.8-533.333333 460.8-533.333333s25.6-38.4 4.266667-51.2z" fill="#7354FF" p-id="7214"></path></svg> 截至2016年，這家美國公司有11個合夥人。</h4>
            <div class="btns-box">
              <div class="button">
                Learn More
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section3" ref="section3">
      <div class="section3-content">
        <div class="section3-content-title">
          <h2>{{ '為什麼選擇我們' }}</h2>
          <p>專注於科技/媒體、醫療健康、消費品/服務、工業科技四個方向的投資</p>
        </div>
        <div class="section3-content-items">
          <div class="items">
            <div class="item">
              <div class="item-img">
                <svg t="1746179551176" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5457"><path d="M587.3445926 994.44148149H437.41866667c-57.6805926 0-104.67555556-46.99496296-104.67555556-104.67555556v-50.26607408c0-19.62666667-8.39585185-37.94488889-22.89777778-50.15703703-72.4005926-61.06074074-113.18044444-150.25303704-111.872-244.8971852 1.1994074-81.88681481 33.91051852-159.08503704 92.24533334-217.3108148 58.33481481-58.22577777 135.53303704-90.93688889 217.31081481-92.1362963 42.85155556-0.54518519 84.39466667 7.30548148 123.75703704 23.44296297 37.83585185 15.59229629 71.96444444 38.05392593 101.18637037 66.94874073 29.33096296 28.89481481 52.33777777 62.58725926 68.36622222 100.31407407 16.68266667 39.03525926 25.07851852 80.46933333 25.07851852 123.21185186 0 92.24533333-40.34370371 179.47496296-110.67259259 239.22725926-14.82903704 12.64829629-23.33392593 30.74844444-23.33392593 49.61185185V889.76592593c0.10903704 57.6805926-46.77688889 104.67555556-104.56651851 104.67555556zM512 304.78222222h-3.48918519c-63.5685926 0.87229629-123.648 26.38696296-169.00740741 71.74637037-45.3594074 45.3594074-70.87407407 105.32977777-71.74637036 168.89837037-1.09037037 73.6 30.6394074 143.0565926 87.01155556 190.48770371 30.31229629 25.62370371 47.75822223 63.35051852 47.75822221 103.58518518V889.76592593c0 19.19051852 15.70133333 34.89185185 34.89185186 34.89185185h150.03496296c19.19051852 0 34.89185185-15.70133333 34.89185185-34.89185185v-51.79259259c0-39.4714074 17.44592593-76.87111111 47.86725926-102.82192593 54.7365926-46.55881481 86.03022223-114.37985185 86.03022222-186.12622223 0-65.85837037-25.84177777-127.68237037-72.7277037-173.91407407-46.12266667-45.46844444-106.85629629-70.32888889-171.51525926-70.32888889z" p-id="5458"></path><path d="M610.46044444 612.59377778c-12.64829629 0-24.7514074-6.86933333-30.96651851-18.8634074l-18.20918519-35.21896297-18.20918518 35.21896297c-5.99703704 11.55792593-17.99111111 18.8634074-30.96651852 18.8634074-12.9754074 0-24.96948148-7.30548148-30.96651852-18.8634074L462.93333333 558.51140741l-18.20918518 35.21896297c-8.832 17.11881481-29.98518519 23.77007407-46.99496296 14.93807407-17.11881481-8.832-23.77007407-29.98518519-14.93807408-46.99496296l49.28474074-94.86222223c5.99703704-11.55792593 17.99111111-18.8634074 30.96651852-18.86340741s24.96948148 7.30548148 30.96651852 18.86340741l18.20918518 35.21896296 18.20918519-35.21896296c5.99703704-11.55792593 17.99111111-18.8634074 30.96651851-18.86340741 13.08444444 0 24.96948148 7.30548148 30.96651852 18.86340741l49.28474075 94.86222223c8.832 17.11881481 2.18074074 38.16296296-14.93807408 46.99496296-5.34281481 2.72592593-10.79466667 3.92533333-16.24651852 3.92533333zM512.54518519 148.75022222c-19.29955556 0-34.89185185-15.59229629-34.89185186-34.89185184v-69.78370371c0-19.29955556 15.59229629-34.89185185 34.89185186-34.89185185s34.89185185 15.59229629 34.89185185 34.89185185v69.78370371c0 19.29955556-15.59229629 34.89185185-34.89185185 34.89185184zM183.36237037 264.22044445L133.9685926 214.82666667c-13.62962963-13.62962963-13.62962963-35.76414815 0-49.39377778s35.76414815-13.62962963 49.39377777 0l49.39377778 49.39377778c13.62962963 13.62962963 13.62962963 35.76414815 0 49.39377778s-35.76414815 13.62962963-49.39377778 0zM792.00711111 264.98370371c-13.62962963-13.62962963-13.62962963-35.76414815 0-49.39377778l49.39377778-49.39377778c13.62962963-13.62962963 35.76414815-13.62962963 49.39377778 0s13.62962963 35.76414815 0 49.39377778L841.40088889 264.98370371c-13.62962963 13.62962963-35.76414815 13.62962963-49.39377778 0z"  p-id="5459"></path></svg>
              </div>
              <div class="item-text">
                <h3>{{ '創造力' }}</h3>
                <h4>{{ '紅杉是專注於投資科技、醫療健康、消費三大領域的私募股權投資機構。' }}</h4>
              </div>
            </div>
            <div class="item">
              <div class="item-img">
                <svg t="1746179381934" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5673"><path d="M276.602 77C164.87 77 73 168.819 73 280.49s91.87 203.49 203.602 203.49h203.603V280.49C477.722 168.82 388.335 77 276.602 77m139.046 342.459H274.119c-76.971 0-141.528-62.04-141.528-141.45 0-76.93 62.074-141.45 141.528-141.45 76.972 0 141.529 62.039 141.529 141.45v141.45M947 280.49C947 168.82 855.13 77 743.398 77c-111.733 0-203.603 91.819-203.603 203.49v203.49h203.603C857.614 481.5 947 392.161 947 280.49m-342.648 0c0-76.93 62.074-141.45 141.529-141.45 76.971 0 141.528 62.04 141.528 141.45 0 76.93-62.074 141.45-141.528 141.45H604.352V280.49M73 747.028c0 111.672 91.87 203.49 203.602 203.49 111.733 0 203.603-91.818 203.603-203.49v-203.49H276.602C162.386 546.02 73 635.357 73 747.028m342.648 0c0 76.93-62.074 141.45-141.529 141.45-76.971 0-141.528-62.039-141.528-141.45 0-76.929 62.074-141.45 141.528-141.45h141.529v141.45m327.75-201.008H539.795v203.49c0 111.671 91.87 203.49 203.603 203.49S947 861.181 947 749.51s-89.386-203.49-203.602-203.49m0 342.459c-76.972 0-141.529-62.04-141.529-141.45V605.577h141.529c76.971 0 141.528 62.04 141.528 141.45 0 79.411-62.074 141.45-141.528 141.45" p-id="5674"></path></svg>
              </div>
              <div class="item-text">
                <h3>{{ '高品質服務' }}</h3>
                <h4>{{ '紅杉資本始終致力於幫助創業者成就基業常青的公司，為成員企業帶來全球資源和歷史經驗。' }}</h4>
              </div>
            </div>
            <div class="item">
              <div class="item-img">
                <svg t="1746179397933" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5828"><path d="M426.666667 254.613333c23.5648 0 42.666667 14.327467 42.666666 32 0 17.672533-19.101867 32-42.666666 32H341.3376c-23.560533 0-42.666667-14.327467-42.666667-32 0-17.672533 19.106133-32 42.666667-32h85.333333z m0 170.257067c23.5648 0 42.666667 14.327467 42.666666 32 0 17.672533-19.101867 32-42.666666 32H341.333333c-23.560533 0-42.6624-14.327467-42.6624-32 0-17.672533 19.101867-32 42.666667-32H426.666667z m435.170133 217.220267c-23.560533 0-29.866667-19.101867-29.866667-42.666667V166.4a17.066667 17.066667 0 0 0-17.066666-17.066667H209.066667a17.066667 17.066667 0 0 0-17.066667 17.066667v691.2a17.066667 17.066667 0 0 0 17.066667 17.066667h302.9248c23.560533 0 42.666667 6.301867 42.666666 29.866666s-19.106133 34.133333-42.666666 34.133334H213.329067C166.203733 938.666667 128 900.462933 128 853.333333V170.666667c0-47.1296 38.203733-85.333333 85.333333-85.333334h597.307734c47.125333 0 85.329067 38.203733 85.329066 85.333334v428.757333c0 23.5648-10.568533 42.666667-34.133333 42.666667z m15.2192 73.220266c16.221867-16.2944 36.650667-22.212267 52.893867-5.9392l0.085333 0.085334c16.256 16.384 7.4112 34.0224-8.8704 50.376533l-165.525333 166.289067a41.322667 41.322667 0 0 1-21.973334 11.562666 41.429333 41.429333 0 0 1-38.404266-11.2768l-82.397867-82.926933c-16.264533-16.3712-22.144-36.957867-5.879467-53.333333 16.200533-16.302933 48.388267 7.253333 64.64 23.509333l0.093867 0.093867L725.333333 867.712l151.722667-152.401067z" p-id="5829"></path></svg>
              </div>
              <div class="item-text">
                <h3>{{ '完成項目' }}</h3>
                <h4>{{ '迄今為止，紅杉中國有超過160家成員企業成功上市，超過140家非上市公司已發展成為獨角獸。' }}</h4>
              </div>
            </div>
            <div class="item">
              <div class="item-img">
                <svg t="1746179351577" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5518"><path d="M938.274173 394.789321C918.743326 172.782722 735.465653 0 513.126287 0 290.812519 0 105.026297 172.757124 88.004 394.789321 36.681132 416.931107 0 468.842716 0 530.532547v98.678132c0 81.451055 65.964604 148.0044 146.59654 148.004399h60.384362c20.580342 0 37.269873-16.894311 37.269873-37.756224V420.156384c0-20.836316-16.689531-37.730627-37.269873-37.730627H161.238276c24.419958-175.137686 170.990901-308.372363 351.888011-308.372362 180.794721 0 327.391261 133.234677 351.913609 308.372362h-45.845015c-20.605939 0-37.39786 16.894311-37.397861 37.730627v319.30247c0 20.836316 16.663934 37.756224 37.372263 37.756224h13.950605c-14.641736 88.823118-80.631937 138.09819-210.180582 150.487352-9.778222-17.278272-29.309069-27.133287-51.322868-27.133287h-72.287171c-33.814219 0-61.945805 27.261274-62.048195 61.433857C437.153085 996.610739 464.081592 1023.89761 498.382162 1023.89761h73.208679c19.556444 0 34.19818-7.372063 46.459354-22.141786 173.627437-12.389161 273.790221-88.951105 288.431957-229.557844 65.964604-12.363564 117.287471-74.053395 117.287471-145.59824v-98.70373c2.508549-59.155684-34.172583-110.964904-85.49545-133.106689zM171.016498 473.50145V686.011399c0 9.394261-7.628037 17.150285-16.919908 17.150285h-7.50005c-40.49515 0-73.234277-33.09749-73.234276-74.053395V530.378962c0-40.827917 32.764724-74.053395 73.208679-74.053395h7.525647c9.419858 0.127987 16.894311 7.730427 16.894311 17.150285z m781.89941 155.606839c0 40.827917-32.867113 74.053395-73.362263 74.053395h-7.50005a17.022298 17.022298 0 0 1-16.894311-17.150285v-212.509949c0-9.419858 7.60244-17.150285 16.894311-17.150285h7.50005c40.49515 0 73.362264 33.09749 73.362263 74.053395v98.703729z" p-id="5519"></path></svg>
              </div>
              <div class="item-text">
                <h3>{{ '24/7支持' }}</h3>
                <h4>{{ '紅杉資本在美國、中國、印度三個國家設有在地化的基金。' }}</h4>
              </div>
            </div>
          </div>
          <div class="item-img">
            <img src="@/assets/images/chosse-img.png" alt="">
          </div>
        </div>
      </div>
    </section>
    <section class="section4" ref="section4">
      <div class="section4-content">
        <div class="section4-content-title">
          <h2>{{ '為什麼選擇我們' }}</h2>
          <p>專注於科技/媒體、醫療健康、消費品/服務、工業科技四個方向的投資</p>
        </div>
        <div class="section4-content-items">
          <div class="item">
            <img src="@/assets/images/1.png" alt="">
            <h3>OKX</h3>
            <p>在追求全體同事物質和精神幸福的同時，推動區塊鏈和數位資產走進全球億萬用戶的生活。</p>
          </div>
          <div class="item">
            <img src="@/assets/images/2.png" alt="">
            <h3>BitoEX</h3>
            <p>致力於推廣台灣數位貨幣而產生，為提供顧客全方位的優質服務與品牌承諾而努力。</p>
          </div>
          <div class="item">
            <img src="@/assets/images/3.png" alt="">
            <h3>MaiCoin</h3>
            <p>MaiCoin 集團成立於 2013 年，旨在讓數位資產成為主流，並為交易者提供安全多樣的選擇。</p>
          </div>
          <div class="item">
            <img src="@/assets/images/4.png" alt="">
            <h3>MaiCoin-Max</h3>
            <p>MaiCoin集團為台灣交易量最大，且唯一具備區塊鏈技術公司之數位資產領導品牌，是台灣虛擬通貨產業之先鋒。</p>
          </div>
          <div class="item">
            <img src="@/assets/images/5.png" alt="">
            <h3>Binance</h3>
            <p>時至今日，幣安已是世界頂尖的區塊鏈生態系，並擁有最大的數位資產交易所。我們的任務是在未來世界中成為加密貨幣的基礎架構供應商。</p>
          </div>
          <div class="item">
            <img src="@/assets/images/6.png" alt="">
            <h3>HTX</h3>
            <p>HTX 成立於 2013 年，經過 11 年的快速發展，已從一家加密貨幣交易所成長為一個全面的區塊鏈業務生態系統。</p>
          </div>
        </div>
      </div>
    </section>
    <footerBottom/>
  </div>
</template>

<style scoped lang="sass">
.cont
  background: #e9fdd8 !important

.button
  padding: 12px 30px
  margin-inline-end: 15px
  font-size: 14px
  font-weight: 500
  line-height: 1
  border-radius: 30px
  color: #fff
  background: #7354ff
  transition: all .3s ease-in-out
  &:hover
    filter: brightness(1.2)
    box-shadow: 0 0 10px rgba(0,0,0,.2)
.index-bg
  background: url('@/assets/images/home-hero-bg.jpg') no-repeat center center  / cover
  width: 100%
  display: flex
  align-items: center
  padding-top: 194px
  padding-bottom: 160px
  @media (max-width: 1200px)
    padding-top: 150px
    padding-inline: 20px
  .index-bg-content
    display: flex
    align-items: center
    width: 1200px
    margin: 0 auto
    @media (max-width: 1200px)
      width: 100%
      flex-direction: column
      .content-left
        width: 100% !important
        margin: 0 !important
      .content-right
        width: 100% !important
        margin-top: 20px
    .content-left
      width: 50%
      padding: .9375rem 2.5rem .9375rem 0
      margin: 0 15px
      color: #fff
      .left-button
        margin-block-start: 1.875rem
        display: flex
        justify-content: flex-start
        .button2
          background: #000b22
    .content-right
      width: 50%
      display: flex
      justify-content: center
.index-main
  width: 1200px
  margin: 0 auto
  @media (max-width: 1200px)
    width: 100%

section
  position: relative
  width: 100%
.section-attain
  opacity: 1 !important
  transform: translateY(-38%)
  will-change: transform, opacity
  @media (max-width: 1200px)
    transform: translateY(-20%)
  @media (max-width: 768px)
    transform: translateY(-10%)
.section-scale
  .section2-content-left,.section2-content-right
    opacity: 1 !important
    transform: translateZ(0) scale(1) !important
    will-change: transform, opacity
  .section4-content .section4-content-title
    opacity: 1 !important
    transform: translateZ(0) scale(1) !important
    will-change: transform, opacity
.section1
  opacity: 0
  transition: all .6s ease-in-out
.section1-content
  width: 1200px
  margin: 0 auto
  display: grid
  grid-template-columns: repeat(4, 1fr)
  gap: 20px
  @media (max-width: 1200px)
    width: 100%
    padding: 0 20px
    grid-template-columns: repeat(2, 1fr)
  @media (max-width: 768px)
    grid-template-columns: repeat(1, 1fr)
  .section1-item
    .icon
      height: 66px
      width: 66px
  .section1-item-content
    padding: 2.875rem .625rem
    box-shadow: 0 0 10px rgba(0,0,0,.2)
    border-radius: 25px
    background: #FFF
    background: linear-gradient(60deg, rgb(255,255,255), rgb(255,241,213))
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    // border-bottom-left-radius: 40px
    // border-bottom-right-radius: 40px
    transition: all .3s ease-in-out
    &:hover
      // background: #7354ff
      background: linear-gradient(60deg, #7354ff 0.42%, #000b22 102.71%)
      color: #FFF
      fill: #FFF
  .section1-item-text
    font-size: 35px
    font-weight: 600
    margin-block: 20px
  .section1-item-title
    font-size: 18px
.section2
  margin: 0 0 100px
  .section2-content
    width: 1200px
    display: flex
    align-items: center
    margin: 40px auto 0 
    @media (max-width: 1200px)
      width: 100%
      padding: 0 20px
      flex-direction: column
      .section2-content-left
        padding-inline: 0
      
    .section2-content-left
      transform: scale(.5)
      opacity: 0
      transition: all .6s ease-in-out
      flex: 1
      padding-inline: 15px
      img
        width: 100%
    .section2-content-right
      transform: scale(.5)
      opacity: 0
      transition: all .6s ease-in-out
      flex: 1
      padding-inline: 15px
      .section2-content-right-title
        font-size: 38px
        line-height: 40px
        font-weight: 600
        margin-bottom: 20px
      .section2-content-right-text
        p
          font-size: 14px
          margin-bottom: 15px
        h4
          font-size: 1rem
          font-weight: 600
          margin-bottom: 15px
          .icon
            display: inline-block
            margin-right: 10px
        .btns-box
          display: flex
          justify-content: flex-start
.section3
  opacity: 0
  transition: all .6s ease-in-out
  .section3-content
    width: 1200px
    margin: 340px auto 0
    @media (max-width: 1200px)
      width: 100%
      margin: 260px auto 0
    @media (max-width: 768px)
      margin: 180px auto 0
    .section3-content-title
      margin-bottom: 40px
      text-align: center
      @media (max-width: 1200px) 
        padding: 0 20px
      h2
        font-size: 38px
        font-weight: 600
        line-height: 40px
        margin-bottom: 20px
      p
        font-size: 14px
        line-height: 1.5
    .section3-content-items
      display: flex
      @media (max-width: 1200px)
        flex-direction: column
        padding: 0 20px
        .items
          padding-inline-end: 0 !important
          margin-bottom: 20px
      .items
        flex: 1
        padding-inline-end: 20px
        .item
          display: flex
          align-items: center
          margin-bottom: 20px
          background: linear-gradient(60deg, rgb(255,255,255), rgb(255,241,213))
          box-shadow: 0 0 10px rgba(0,0,0,.2)
          padding: .8rem 1rem
          border-radius: 20px
          transition: all .3s ease-in-out
          &:hover
            // background: #7354ff
            // background: linear-gradient(to right, rgb(142, 45, 226), rgb(74, 0, 224))
            background: linear-gradient(60deg, #7354ff 0.42%, #000b22 102.71%)
            .icon
              fill: #FFF !important
            .item-text
              color: #FFF
          &:last-child
            margin-bottom: 0
          .icon
            width: 48px
            height: 48px
            transition: all .3s ease-in-out
          .item-text
            margin-inline-start: 16px
            transition: all .3s ease-in-out
            h3
              font-size: 18px
              font-weight: 600
              line-height: 20px
            h4
              font-size: 14px
              line-height: 24px
              min-height: 48px
      .item-img
        img
          width: 100%
          height: 100%
          object-fit: cover
          border-radius: 20px
.section4
  .section4-content
    width: 1200px
    margin: 0 auto 100px
    @media (max-width: 1200px)
      width: 100%
      padding: 0 20px
    .section4-content-title
      margin-bottom: 40px
      text-align: center
      opacity: 0
      transform: scale(.5)
      transition: all .6s ease-in-out
      h2
        font-size: 38px
        font-weight: 600
        line-height: 40px
        margin-bottom: 20px
      p
        font-size: 14px
        line-height: 1.5
    .section4-content-items
      margin-top: 75px
      display: grid
      grid-template-columns: repeat(3, 1fr)
      gap: 20px
      justify-content: space-between
      @media (max-width: 1200px)
        grid-template-columns: repeat(2, 1fr)
      @media (max-width: 768px)
        grid-template-columns: repeat(1, 1fr)
      .item
        position: relative
        overflow: hidden
        background: linear-gradient(60deg, rgb(255,255,255), rgb(255,241,213))
        box-shadow: 0 15px 25px 0 rgba(0, 0, 0, 0.1)
        padding: 1.8rem 1rem
        border-radius: 20px
        transition: all .3s ease-in-out
        &:hover
          color: #fff
          // background: #7354ff
          background: linear-gradient(60deg, #7354ff 0.42%, #000b22 102.71%)
        img
          width: 66px
          height: 66px
          object-fit: cover
          margin-bottom: 10px
          border-radius: 5px
        h3
          font-size: 18px
          font-weight: 600
</style>
