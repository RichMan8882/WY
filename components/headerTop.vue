<script lang="ts" setup>
const siteStore = useSiteStore()
const { isLogin, signout } = useAuthStore()
const PlayerStore = usePlayerStore()
const emit = defineEmits(['onPopupState', 'onShopping'])
const props = defineProps({
  opaque: { type: Boolean, default: false },
  absolute: { type: Boolean, default: false },
  top: { type: Boolean, default: false },
  menu: { type: Boolean, default: true },
  styles: { type: String, default: '' },
  routerCrt: { type: String, default: '/' },
  headerW100: { type: String, default: '' },
  timer: { type: Number, default: 0 }
})
const playerWalletBalance = computed(() => {
  if (!isLogin()) {
    return 0
  }

  const findWallet = PlayerStore.playerInfo?.wallet.find(
    (wallet: any) => wallet.type === 1
  )
  console.log(findWallet)

  if (findWallet) {
    return Number(findWallet.balance)
  } else {
    return 0
  }
})

const isCont = ref(false)
const isShw = ref(false)

const onPopup = () => {
  isShw.value = !isShw.value
  setTimeout(() => {
    isCont.value = !isCont.value
  }, 100)
}
const onClose = () => {
  isCont.value = !isCont.value
  setTimeout(() => {
    isShw.value = !isShw.value
  }, 300)
}
watch(
  () => isCont.value,
  (newVal) => {
    console.log('isCont.value', newVal)
    emit('onPopupState', newVal)
  }
)

const handleClick = (event) => {
  // console.log('点击了页面任意位置', event.target)
  if (showLang.value) {
    showLang.value = false
  }

}

onMounted(() => {
  document.addEventListener('click', handleClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClick, true)
  showMssage.value = false
  showMask.value = false
  showInfo.value = false
  showLang.value = false
  showShoppingCart.value = false
})

const showLang = ref(false)
const showMask = ref(false)
const onMask = () => {
  showMask.value = !showMask.value
  searchVal.value = ''

}
import scroll1to1 from '@/assets/images/scroll-1.webp'
import scroll1to2 from '@/assets/images/scroll-2.webp'
import scroll1to3 from '@/assets/images/scroll-3.webp'
import scroll1to4 from '@/assets/images/scroll-4.webp'
const shoppingLis = ref([
  {
    title: '【WINYI】小黑鵝仿真手指按摩棒',
    image: scroll1to3,
    amount: 2,
    id: 1,
    price: 3888,
    oldPrice: 1888,
    stock: 50,
    createTime: '2025-07-05'
  },

  {
    title: "【WINYI】海后雙頭震動按摩棒",
    image: scroll1to4,
    amount: 1,
    price: 3888,
    oldPrice: 1888,
    stock: 50,
    createTime: '2025-07-05',
    id: 4
  },
])

const showShoppingCart = ref(false)
const onShoppingCart = () => {
  if (!isLogin()) {
    navigateTo('/login')
    return
  }
  showShoppingCart.value = !showShoppingCart.value
}

const isAnimating = ref(false)
const direction = ref('left')
const status = ref('等待动画开始')

const triggerAnimation = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  status.value = '飞入中'
  showShoppingCart.value = true
  // 3秒后触发飞出动画
  setTimeout(() => {
    status.value = '飞出中'
    showShoppingCart.value = false
    // 动画结束后重置状态
    setTimeout(() => {
      isAnimating.value = false
      status.value = '动画完成，等待下一次'
    }, 1000)
  }, 1000)
}

const deleteItem = (item: any, index?: number) => {
  // 删除商品
  shoppingLis.value = shoppingLis.value.filter(i => i.id !== item.id)
  // if( shoppingLis.value.length === 0 ){
  //   showShoppingCart.value = false
  // }
}
watch(
  () => props.timer,
  (newVal) => {
    console.log(newVal);
    const num = shoppingLis.value.length
    shoppingLis.value.push({
      title: "【WINYI】海后雙頭震動按摩棒",
      image: scroll1to4,
      amount: 1,
      price: 3888,
      oldPrice: 1888,
      stock: 50,
      createTime: '2025-07-05',
      id: Math.floor(Math.random() * 100)
    })
    if (num < shoppingLis.value.length) {
      triggerAnimation()
    }
  }
)

// 聯絡我們
const showMssage = ref(false)
const onShowMessage = () => {
  showMssage.value = !showMssage.value
}

// 個人信息
const showInfo = ref(false)
const onNavInfo = () => {
  if (!isLogin()) {
    navigateTo('/login')
  }
  showInfo.value = !showInfo.value

}

const searchVal = ref('')
const onSearch = () => {
  if (searchVal.value.length != 0) {
    ElMessage({
      message: searchVal.value,
      type: 'success'
    })
  }
  onMask()
}

const Language = ref('zh-TW')
const changeLanguage = (lang: string) => {
  Language.value = lang
  // siteStore.changeLanguage(lang)
}

</script>
<template>
  <div>
    <header :class="{
      opaque: props.opaque,
      absolute: absolute,
      top: top
    }" :style="styles">
      <div class="header-bulletin">
        <div class="announcement__slider announcement__slider--animation">
          <a href="">
            <h4>浪漫七夕 結帳滿 $𝟵𝟵𝟵 免運 (限台灣)</h4>
          </a>
          <a href="">
            <h4>全館玩具輸入優惠代碼「七夕」現折$𝟱𝟬元</h4>
          </a>
          <a href="">
            <h4>任一玩具＋項圈組合 贈 香蕉口交液</h4>
          </a>
          <a href="">
            <h4>浪漫七夕 結帳滿 $𝟵𝟵𝟵 免運 (限台灣)</h4>
          </a>
        </div>
      </div>
      <div class="header-nav">
        <div class="header-mask" v-if="showMask" @click.self="onMask"></div>
        <div class="logo" @click="navigateTo('/')">
          <img :src="siteStore.siteData?.logo" alt="logo" />
        </div>
        <div class="nav">
          <div class="header-tool">
            <div class="tools">
              <div class="t-item hide-mobi">
                <svg t="1755263678337" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="2146" width="20" height="20" @click="showLang = !showLang">
                  <path
                    d="M694.857143 313.782857C665.014857 129.462857 594.358857 0 512.219429 0 430.08 0 359.350857 129.462857 329.435429 313.782857H694.857143zM366.006857 21.430857A512.585143 512.585143 0 0 0 39.862857 313.782857h223.085714c17.92-117.467429 52.589714-222.573714 102.985143-292.352z m618.496 292.352A513.097143 513.097143 0 0 0 658.139429 21.430857c50.322286 69.778286 85.065143 174.811429 103.204571 292.352h223.085714zM247.881143 512c0-44.324571 2.486857-88.868571 6.802286-132.096H17.773714A514.998857 514.998857 0 0 0 0 512c0 45.787429 6.582857 89.819429 17.773714 132.096h236.617143a1417.069714 1417.069714 0 0 1-6.582857-132.096z m65.974857 0c0 45.860571 2.56 89.819429 6.875429 132.096h382.537142c4.388571-42.422857 6.875429-86.308571 6.875429-132.096 0-45.714286-2.486857-89.819429-6.875429-132.096h-382.537142c-4.388571 42.276571-6.875429 86.308571-6.875429 132.096z m692.516571-132.096h-236.763428c4.388571 43.373714 6.875429 87.771429 6.875428 132.096 0 44.324571-2.56 88.868571-6.875428 132.096h236.617143c11.337143-42.422857 17.773714-86.308571 17.773714-132.096 0-45.714286-6.436571-89.819429-17.627429-132.096zM658.285714 1002.422857a513.755429 513.755429 0 0 0 326.290286-292.352h-223.158857c-18.212571 117.613714-52.736 222.72-103.131429 292.352zM39.862857 710.217143a513.097143 513.097143 0 0 0 326.363429 292.352c-50.468571-69.778286-85.138286-174.811429-103.277715-292.352H39.862857z m289.499429 0C359.350857 894.537143 430.08 1024 512.146286 1024 594.285714 1024 664.868571 894.537143 694.857143 710.217143H329.362286z"
                    p-id="2147"></path>
                </svg>
                <div :class="showLang ? 'sele-mask' : ''" @click="showLang = false"></div>
                <div class="t-item-sele" v-if="showLang">
                  <ul>
                    <li>English</li>
                    <li>繁體中文</li>
                  </ul>
                </div>

              </div>
              <div class="t-item">
                <div class="search">
                  <div class="hide-mobi" :class="showMask ? 'search-input-mobi' : ''">
                    <input type="text" :placeholder="$lang('找商品')" v-model="searchVal" />
                    <svg t="1755263667764" class="icon show-mobi" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="1984" width="20" height="20" @click.stop="onSearch">
                      <path
                        d="M599.04151666 599.04151666a48.54518557 48.54518557 0 0 1 68.64289223 0l266.9985189 266.99851889a48.54518557 48.54518557 0 0 1-68.64289224 68.64289224l-266.99851889-266.9985189a48.54518557 48.54518557 0 0 1 0-68.64289223z"
                        p-id="1985"></path>
                      <path
                        d="M414.90963001 172.18370333a242.72592555 242.72592555 0 1 0 0 485.45185222 242.72592555 242.72592555 0 0 0 0-485.45185222z m-339.81629668 242.72592668a339.81629667 339.81629667 0 1 1 679.63259222 0 339.81629667 339.81629667 0 0 1-679.63259222 0z"
                        p-id="1986"></path>
                    </svg>
                  </div>
                  <svg t="1755263667764" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="1984" width="20" height="20" @click.stop="onSearch">
                    <path
                      d="M599.04151666 599.04151666a48.54518557 48.54518557 0 0 1 68.64289223 0l266.9985189 266.99851889a48.54518557 48.54518557 0 0 1-68.64289224 68.64289224l-266.99851889-266.9985189a48.54518557 48.54518557 0 0 1 0-68.64289223z"
                      p-id="1985"></path>
                    <path
                      d="M414.90963001 172.18370333a242.72592555 242.72592555 0 1 0 0 485.45185222 242.72592555 242.72592555 0 0 0 0-485.45185222z m-339.81629668 242.72592668a339.81629667 339.81629667 0 1 1 679.63259222 0 339.81629667 339.81629667 0 0 1-679.63259222 0z"
                      p-id="1986"></path>
                  </svg>
                </div>
              </div>
              <div class="t-item hide-mobi" @click="onShowMessage">
                <svg t="1755263638627" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="1347" width="20" height="20">
                  <path
                    d="M823.135226 106.515942 195.565071 106.515942c-71.733765 0-130.09087 63.59848-130.09087 141.771911l0 402.309762c0 78.171384 58.358129 141.769864 130.09087 141.769864l20.697391 0L216.262462 898.128221c0 31.728632 23.611767 57.547671 52.629661 57.547671 10.321066 0 20.581758-3.5038 29.436426-9.965979l216.755696-153.341411 308.055075 0c71.731718 0 130.09087-63.59848 130.09087-141.769864L953.23019 248.288876C953.225073 170.114422 894.867968 106.515942 823.135226 106.515942L823.135226 106.515942zM332.590887 407.282007c21.366633 0 38.688137 18.877953 38.688137 42.163285 0 23.283286-17.321504 42.162262-38.688137 42.162262-21.36254 0-38.689161-18.877953-38.689161-42.162262C293.900703 426.15996 311.228347 407.282007 332.590887 407.282007L332.590887 407.282007zM509.351684 491.607554c-21.366633 0-38.689161-18.877953-38.689161-42.162262 0-23.285333 17.322527-42.163285 38.689161-42.163285 21.36561 0 38.683021 18.877953 38.683021 42.163285C548.034704 472.729601 530.717294 491.607554 509.351684 491.607554L509.351684 491.607554zM686.10941 491.607554c-21.366633 0-38.689161-18.877953-38.689161-42.162262 0-23.285333 17.322527-42.163285 38.689161-42.163285 21.36561 0 38.688137 18.877953 38.688137 42.163285C724.797547 472.729601 707.47502 491.607554 686.10941 491.607554L686.10941 491.607554zM686.10941 491.607554"
                    p-id="1348"></path>
                </svg>
              </div>
              <div class="t-item" @click="onNavInfo">
                <svg t="1755263649275" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="1662" width="20" height="20">
                  <path
                    d="M513.21706667 515.31733333c121.78026667 0 220.41706667-98.6368 220.41706666-220.41706666S634.99733333 74.4832 513.21706667 74.4832 292.79893333 173.12 292.79893333 294.90026667 391.43573333 515.31733333 513.21706667 515.31733333z m0 110.208c-147.12853333 0-440.83413333 73.84-440.83413334 220.41706667v110.208h881.66826667v-110.208c-0.00106667-146.57706667-293.70666667-220.41706667-440.83413333-220.41706667z"
                    p-id="1663"></path>
                </svg>

                <div :class="showInfo ? 'sele-mask' : ''" @click="showLang = false"> </div>
                <div class="t-item-sele" v-if="showInfo" style="width: 150px;">
                  <ul>
                    <div style="padding: 0 10px 10px;" v-if="isLogin()">{{ PlayerStore.playerInfo?.account }}</div>
                    <li v-if="isLogin()" @click="navigateTo('/address')">{{ $lang('地址管理') }}</li>
                    <li @click="signout" v-if="isLogin()">{{ $lang('登出') }}</li>
                    <li @click="navigateTo('/login')" v-if="!isLogin()">{{ $lang('會員登入') }}</li>
                    <li @click="navigateTo('/register')" v-if="!isLogin()">{{ $lang('新用戶注冊') }}</li>
                  </ul>
                </div>


              </div>
              <div class="t-item" @click="onShoppingCart">
                <span class="purchase-volume" v-if="isLogin() && shoppingLis.length > 0">
                  {{ shoppingLis.length }}
                </span>
                <svg t="1755263659391" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="1823" width="20" height="20">
                  <path
                    d="M356.48 788.48q18.24 0 34.56 6.72t28.32 18.72 19.2 28.32 7.2 34.56-7.2 34.56-19.2 28.32-28.32 19.2-34.56 7.2q-19.2 0-35.52-7.2t-28.32-19.2-19.2-28.32-7.2-34.56 7.2-34.56 19.2-28.32 28.32-18.72 35.52-6.72zM755.84 790.4q18.24 0 35.04 6.72t28.8 18.72 19.2 28.32 7.2 34.56-7.2 34.56-19.2 28.32-28.8 19.2-35.04 7.2-34.56-7.2-28.32-19.2-19.2-28.32-7.2-34.56 7.2-34.56 19.2-28.32 28.32-18.72 34.56-6.72zM917.12 245.12q26.88 0 41.76 7.2t21.12 17.76 5.76 22.56-3.36 20.64-12.48 35.52-20.64 59.04-22.08 63.84-17.76 49.92q-12.48 38.4-31.2 53.28t-46.56 14.88l-33.6 0-61.44 0-80.64 0-90.24 0-238.08 0 13.44 86.4 484.8 0q46.08 0 46.08 39.36 0 19.2-9.12 33.12t-36 13.92l-46.08 0-88.32 0-111.36 0-112.32 0-93.12 0-51.84 0q-19.2 0-32.16-8.64t-21.6-22.56-13.92-30.24-8.16-30.72q-0.96-5.76-5.28-27.84t-10.56-55.2-13.92-73.92-15.36-82.08q-18.24-96.96-41.28-216l-72 0q-14.4 0-24-7.2t-15.84-17.28-8.64-21.6-2.4-21.12q0-19.2 12.96-31.68t35.04-12.48l20.16 0 20.16 0 24 0 32.64 0q19.2 0 30.72 5.76t18.24 14.4 9.6 18.24 4.8 16.32q1.92 7.68 3.84 21.6t3.84 28.32q2.88 17.28 5.76 36.48l656.64 0zM845.12 214.4l-351.36 0 126.72-126.72q22.08-22.08 48.48-22.56t48.48 21.6z"
                    p-id="1824"></path>
                </svg>
              </div>
              <div class="t-item">
                <!-- 麵包屑 -->
                <div class="sl-menu-panel-toggle" @click="onPopup">
                  <i></i>
                </div>
              </div>
            </div>
          </div>
          <div class="header-logo">
            <img src="/assets/images/WY.png" alt="" />
          </div>
          <div class="header" :style="headerW100">
            <ul class="menu" v-if="menu">

              <li>
                <a @click="navigateTo('/productcategories')">所有商品</a>
              </li>

              <li class="has-dropdown active menu-thumb">
                <a>
                  <span>男士系列</span>
                  <svg t="1755259222739" class="icon icon-aloof" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="6612" width="12" height="12">
                    <path
                      d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                      fill="#1F2635" p-id="6613"></path>
                  </svg>
                  <svg t="1755259509405" class="icon icon-touch" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="6769" width="12" height="12">
                    <path
                      d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                      fill="#baa38f" p-id="6770"></path>
                  </svg>
                </a>
                <div class="submenu">
                  <ul>
                    <li>
                      <a href="">自慰蛋</a>
                    </li>
                    <li>
                      <a href="">彩虹玩具</a>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="has-dropdown active menu-thumb">
                <a>
                  <span>女士系列</span>
                  <svg t="1755259222739" class="icon icon-aloof" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="6612" width="12" height="12">
                    <path
                      d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                      fill="#1F2635" p-id="6613"></path>
                  </svg>
                  <svg t="1755259509405" class="icon icon-touch" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="6769" width="12" height="12">
                    <path
                      d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                      fill="#baa38f" p-id="6770"></path>
                  </svg>
                </a>
                <div class="submenu">
                  <ul>
                    <li>
                      <a href=""> 吸吮按摩器 </a>
                    </li>
                    <li>
                      <a href=""> 震動跳蛋 </a>
                    </li>
                    <li>
                      <a href=""> 震動按摩棒 </a>
                    </li>
                    <li>
                      <a href=""> 凱格爾聰明球 </a>
                    </li>
                  </ul>
                </div>
              </li>

              <li class="has-dropdown active menu-thumb">
                <a>
                  <span>情趣教科書</span>
                  <svg t="1755259222739" class="icon icon-aloof" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="6612" width="12" height="12">
                    <path
                      d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                      fill="#1F2635" p-id="6613"></path>
                  </svg>
                  <svg t="1755259509405" class="icon icon-touch" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="6769" width="12" height="12">
                    <path
                      d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                      fill="#baa38f" p-id="6770"></path>
                  </svg>
                </a>
                <div class="submenu">
                  <ul>
                    <li>
                      <a @click="navigateTo('/articlelist')"> Ｗ專欄 </a>
                    </li>

                  </ul>
                </div>
              </li>
              <li>
                <a @click="navigateTo('/faq')">{{ $lang('常見問答') }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <!-- 購物車彈出 -->
    <div :class="showShoppingCart && !isAnimating ? 'shopping-cart-container' : ''" @click.self="onShoppingCart"></div>
    <div class="shopping-cart" :class="showShoppingCart ? 'shopping-cart-active' : ''">
      <div class="shopping-cart-conts" v-if="shoppingLis.length">
        <div class="shopping-cart-cont" v-for="(item, index) in shoppingLis" :key="index">
          <img :src="scroll1to2" alt="">
          <h5>{{ item.title }}</h5>
          <div class="specification">
            <div class="price">
              <span class="price-text">{{ item.amount }} <span> x </span> HK$ {{ item.price }}</span>
              <a @click="deleteItem(item, index)">
                <i class="fa-solid fa-trash-can delete"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="checkout" v-if="shoppingLis.length">
        <div class="ck-btn">訂單結帳</div>
      </div>
      <div class="empty" v-else>
        <div class="empty-text">你的購物車是空的</div>
      </div>
    </div>

    <!-- 聯絡我們彈出 -->
    <div :class="showMssage ? 'popup-contact' : ''" @click.self="onShowMessage">
      <!-- 表單提交 -->
      <div class="modal-body" :class="showMssage ? 'modal-body-active' : ''">
        <div class="msg-form">
          <div class="message-shop">
            <div class="message-title">
              聯絡我們
            </div>
            <div class="message-title">
              謝謝您的主動聯絡，請留下要諮詢的問題，我們會用以下資訊進行回覆。
            </div>
            <div class="contact-info">
              <div class="form-group">
                <div class="controls">
                  <input class="form-control email"
                    ng-pattern="/^(?:[^+\-_!#$%*^/?`{|}~&lt;&gt;()[\]\\.,;:\s@&quot;](?:(?:[^+!#$%*^/?`{|}~&lt;&gt;()[\]\\.,;:\s@&quot;]|([+.])(?!\1)(?!@)|[+](?=@))*)|(?:&quot;[^!#$%*^/?`{|}~]+&quot;))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/"
                    placeholder="輸入你的電子信箱" type="email">
                </div>
                <p class="help-block hide">
                  電郵 是必須的
                </p>
              </div>
              <div class="form-group">
                <div class="controls">
                  <textarea class="form-control text-area" name="message_text"
                    placeholder="輸入你的訊息。若是詢問店內特定商品，請留下商品名稱，也歡迎你留下電子信箱以外的聯絡方式，謝謝！"></textarea>
                </div>
                <p class="help-block hide">
                  你的訊息 是必須的
                </p>
              </div>
              <div class="text-right">
                <button class="sub-btn">
                  發送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- popup -->
    <div v-show="isShw" class="popup-wrapper" @click.self="onClose">
      <div class="popup-content" :class="{
        'cont-left': isCont,
        dark:
          routerCrt == '/game/cointrading' ||
          routerCrt == '/game/perpetualcontract'
      }" @click.stop="">
        <!-- <div class="popup-title">
          <span>
            <span v-if="isLogin() && menu">
              NT
              <i class="fa-solid fa-dollar-sign"></i>
              {{ new Intl.NumberFormat('zh-TW').format(playerWalletBalance) }}
            </span>
            <span v-if="isLogin() && !menu">
              {{ PlayerStore.playerInfo?.account }}
            </span>
          </span>
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjOEI5NUEwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSI+PHBhdGggZD0iTTIuNSAxLjVsMTYuMjYzIDE2LjI2M00xOC41IDEuNUwyLjIzNyAxNy43NjMiLz48L2c+PC9zdmc+"
            alt="" @click="onClose" />
        </div> -->
        <div class="popup-menus">
          <ul class="menus" v-if="menu">


            <li>
              <a @click="navigateTo('/productcategories')">所有商品</a>
            </li>

            <li class="has-dropdown menu-thumb">
              <a>
                <span>男士系列</span>
                <svg t="1755259222739" class="icon icon-aloof" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="6612" width="12" height="12">
                  <path
                    d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                    fill="#1F2635" p-id="6613"></path>
                </svg>
              </a>
              <div class="submenu">
                <ul>
                  <li>
                    <a href="">自慰蛋</a>
                  </li>
                  <li>
                    <a href="">彩虹玩具</a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="has-dropdown menu-thumb">
              <a>
                <span>女士系列</span>
                <svg t="1755259222739" class="icon icon-aloof" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="6612" width="12" height="12">
                  <path
                    d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                    fill="#1F2635" p-id="6613"></path>
                </svg>
              </a>
              <div class="submenu">
                <ul>
                  <li>
                    <a href=""> 吸吮按摩器 </a>
                  </li>
                  <li>
                    <a href=""> 震動跳蛋 </a>
                  </li>
                  <li>
                    <a href=""> 震動按摩棒 </a>
                  </li>
                  <li>
                    <a href=""> 凱格爾聰明球 </a>
                  </li>
                </ul>
              </div>
            </li>

            <li class="has-dropdown menu-thumb">
              <a>
                <span>情趣教科書</span>
                <svg t="1755259222739" class="icon icon-aloof" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="6612" width="12" height="12">
                  <path
                    d="M458.73 752.56c1 1.06 2.05 2.1 3.13 3.12 14.22 13.34 32.8 20.36 52.35 19.77 19.54-0.59000001 37.67-8.71 51.05999999-22.88l394.66000001-417.48-81.85-86.58L512 635.76l-366.08-387.24-81.85 86.58 394.66 417.46z"
                    fill="#1F2635" p-id="6613"></path>
                </svg>
              </a>
              <div class="submenu">
                <ul>
                  <li>
                    <a @click="navigateTo('/articlelist')"> Ｗ專欄 </a>
                  </li>

                </ul>
              </div>
            </li>
            <li>
              <a @click="navigateTo('/faq')">
                <span>
                  {{ $lang('常見問答') }}
                </span>

              </a>
            </li>
          </ul>
          <div class="mobi-add">
            <h3>{{ $lang('帳戶') }}</h3>
            <a @click="navigateTo('/login')" v-if="!isLogin()">{{ $lang('會員登入') }}</a>
            <a @click="navigateTo('/register')" v-if="!isLogin()">{{ $lang('新用戶注冊') }}</a>
            <a v-if="isLogin()">
              <span> {{ PlayerStore.playerInfo?.account }}</span>
              <svg t="1756115863973" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="16483" width="18" height="18">
                <path
                  d="M511.517156 0.995555a510.492019 510.492019 0 0 1 511.487574 511.516018A510.492019 510.492019 0 0 1 511.517156 1023.999147 510.492019 510.492019 0 0 1 0.001138 512.511573 510.492019 510.492019 0 0 1 511.517156 0.995555"
                  fill="#767676" p-id="16484" data-spm-anchor-id="a313x.search_index.0.i17.3a733a81mE5VWr"
                  class="selected"></path>
                <path
                  d="M497.778501 511.999573c-141.311882 0-257.791785 91.761701-270.221997 204.401608v25.03109l0.312888 7.566216A83.569708 83.569708 0 0 0 310.671101 824.888201h374.214799l7.509327-0.341333A83.626597 83.626597 0 0 0 768.000498 741.432271v-20.84976l-1.422221-10.55288C748.459181 598.32839 634.852164 511.999573 497.778501 511.999573M497.778501 199.110945C410.482573 199.110945 341.334187 271.07533 341.334187 357.318813 341.334187 443.676075 410.482573 511.999573 497.778501 511.999573s156.444314-68.323499 156.444314-154.68076C654.222815 271.07533 585.074428 199.110945 497.778501 199.110945"
                  fill="#bfbfbf" p-id="16485" data-spm-anchor-id="a313x.search_index.0.i16.3a733a81mE5VWr" class="">
                </path>
              </svg>
            </a>
            <a v-if="isLogin()" @click="navigateTo('/address')">
              <span> {{ $lang('地址管理') }} </span>
              <svg t="1756115736075" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="14499" width="18" height="18">
                <path
                  d="M488.163105 454.695876c0 40.981367 33.468253 74.205049 74.751494 74.205049 41.284265 0 74.752518-33.222659 74.752518-74.205049 0-40.98239-33.468253-74.206072-74.752518-74.206072C521.631358 380.489804 488.163105 413.713486 488.163105 454.695876L488.163105 454.695876 488.163105 454.695876zM488.163105 454.695876"
                  p-id="14500" fill="#bfbfbf"></path>
                <path
                  d="M264.015046 79.124082c-55.19509 0-99.773378 44.275389-99.773378 98.892311l0 74.260308-63.936171 0c-20.880563 0-37.899168 16.902972-37.899168 37.753859 0 20.996197 16.966417 37.754882 37.899168 37.754882l63.936171 0 0 72.901357-63.936171 0c-20.880563 0-37.899168 16.902972-37.899168 37.754882 0 20.999266 16.966417 37.753859 37.899168 37.753859l63.936171 0 0 72.907497-63.936171 0c-20.880563 0-37.899168 16.902972-37.899168 37.753859 0 20.996197 16.966417 37.754882 37.899168 37.754882l63.936171 0 0 72.906473 0 75.508741 0 72.955592c0 54.766324 44.669362 98.893334 99.773378 98.893334l597.803201 0c55.196113 0 99.774401-44.276413 99.774401-98.893334L961.592648 178.016393c0-54.769394-44.673455-98.892311-99.774401-98.892311L264.015046 79.124082 264.015046 79.124082zM562.9146 726.789924c-30.964222 0-149.502989-154.216337-149.502989-272.094048 0-117.877711 77.316923-157.485801 149.502989-157.485801 72.187089 0 149.504012 37.253462 149.504012 157.485801S593.878822 726.789924 562.9146 726.789924L562.9146 726.789924 562.9146 726.789924zM562.9146 726.789924"
                  p-id="14501" fill="#767676"></path>
              </svg>
            </a>
            <a v-if="isLogin()" @click="signout">
              <span>
                {{ $lang('登出') }}
              </span>
              <svg t="1756115679182" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="12442" width="18" height="18">
                <path
                  d="M767.986697 174.60776c29.986965 21.286816 56.608276 45.414329 79.868025 72.355935 23.316032 26.970258 43.268456 56.087413 59.914578 87.349417 16.647145 31.29168 29.291117 64.381309 37.932937 99.326193s12.991895 70.355371 12.991895 106.316397c0 61.887512-11.83249 119.945813-35.43914 174.176948-23.663956 54.231135-55.565527 101.501742-95.875604 141.754514-40.252773 40.252773-87.466074 72.181973-141.753491 95.818299-54.172807 23.635303-112.289436 35.438117-174.176948 35.438117-61.191664 0-118.90204-11.802814-173.191504-35.438117-54.172807-23.636327-101.617375-55.565527-142.218072-95.818299-40.600697-40.281425-72.501244-87.523379-95.817276-141.754514-23.317055-54.231135-34.917254-112.289436-34.917254-174.176948 0-35.265178 4.117784-69.891813 12.412704-103.821577 8.352225-33.930787 20.184715-66.207911 35.496445-96.833419 15.311731-30.594809 34.220383-59.21873 56.840566-85.841064 22.620184-26.623357 47.90915-50.576909 75.865875-71.863724 14.674211-10.643408 30.507828-14.645558 47.444569-11.977799 16.935718 2.667759 30.740118 10.962679 41.412179 24.941042 10.67206 13.977339 14.616906 29.609365 12.006452 46.922682-2.667759 17.313318-10.961656 31.29168-24.998347 41.934065-41.87676 30.595832-74.009597 68.209498-96.281857 112.783693-22.272259 44.602847-33.466206 92.510974-33.466206 143.755078 0 43.906999 8.293897 85.34783 24.998347 124.267235 16.587793 38.948057 39.382962 72.878844 68.325132 101.821013 29.000498 28.942169 62.872956 51.9113 101.849666 68.876694 38.918381 16.965393 80.331583 25.433252 124.238582 25.433252 43.964304 0 85.377506-8.467859 124.295887-25.433252s72.849168-39.933501 101.849666-68.876694c28.942169-28.942169 51.852972-62.872956 68.847018-101.821013 16.994046-38.918381 25.461905-80.359212 25.461905-124.267235 0-51.9113-12.005428-100.979856-35.961026-147.235342-23.953551-46.25651-57.537438-84.362386-100.805894-114.291023-14.615882-9.976212-23.431665-23.635303-26.448372-40.918945-3.015683-17.313318 0.521886-33.293267 10.498098-47.938825 9.976212-13.977339 23.606651-22.446221 40.891316-25.433252C737.420541 161.121608 753.370815 164.631548 767.986697 174.60776L767.986697 174.60776 767.986697 174.60776 767.986697 174.60776zM511.44895 542.942733c-17.284665 0-32.075533-6.148024-44.428885-18.473747-12.297071-12.296047-18.444071-27.115568-18.444071-44.428885L448.575993 100.742449c0-17.313318 6.148024-32.277124 18.444071-44.921095 12.353352-12.642948 27.14422-18.965957 44.428885-18.965957 17.97949 0 33.118282 6.323009 45.414329 18.965957 12.354376 12.643971 18.502399 27.607778 18.502399 44.921095l0 379.297652c0 17.313318-6.148024 32.132838-18.502399 44.428885C544.567231 536.795732 529.42844 542.942733 511.44895 542.942733L511.44895 542.942733 511.44895 542.942733 511.44895 542.942733zM511.44895 542.942733"
                  fill="#767676" p-id="12443"></path>
              </svg>
            </a>
          </div>
          <div class="mobi-add">
            <h3>{{ $lang('其他') }}</h3>
            <a @click="onShowMessage">
              <span>{{ $lang('聯絡我們') }}</span>
              <svg t="1755263638627" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="1347" width="18" height="18">
                <path
                  d="M823.135226 106.515942 195.565071 106.515942c-71.733765 0-130.09087 63.59848-130.09087 141.771911l0 402.309762c0 78.171384 58.358129 141.769864 130.09087 141.769864l20.697391 0L216.262462 898.128221c0 31.728632 23.611767 57.547671 52.629661 57.547671 10.321066 0 20.581758-3.5038 29.436426-9.965979l216.755696-153.341411 308.055075 0c71.731718 0 130.09087-63.59848 130.09087-141.769864L953.23019 248.288876C953.225073 170.114422 894.867968 106.515942 823.135226 106.515942L823.135226 106.515942zM332.590887 407.282007c21.366633 0 38.688137 18.877953 38.688137 42.163285 0 23.283286-17.321504 42.162262-38.688137 42.162262-21.36254 0-38.689161-18.877953-38.689161-42.162262C293.900703 426.15996 311.228347 407.282007 332.590887 407.282007L332.590887 407.282007zM509.351684 491.607554c-21.366633 0-38.689161-18.877953-38.689161-42.162262 0-23.285333 17.322527-42.163285 38.689161-42.163285 21.36561 0 38.683021 18.877953 38.683021 42.163285C548.034704 472.729601 530.717294 491.607554 509.351684 491.607554L509.351684 491.607554zM686.10941 491.607554c-21.366633 0-38.689161-18.877953-38.689161-42.162262 0-23.285333 17.322527-42.163285 38.689161-42.163285 21.36561 0 38.688137 18.877953 38.688137 42.163285C724.797547 472.729601 707.47502 491.607554 686.10941 491.607554L686.10941 491.607554zM686.10941 491.607554"
                  p-id="1348" fill="#767676"></path>
              </svg>
            </a>
            <a>
              <div class="t-item-sele">
                <ul>
                  <li :class="Language == 'zh-TW' ? 'sele-active' : ''" @click="changeLanguage('zh-TW')">繁體中文</li>
                  <li :class="Language == 'en' ? 'sele-active' : ''" @click="changeLanguage('en')">English</li>
                </ul>
              </div>
              <!-- <svg t="1755263678337" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2146" width="20" height="20">
                <path
                  d="M694.857143 313.782857C665.014857 129.462857 594.358857 0 512.219429 0 430.08 0 359.350857 129.462857 329.435429 313.782857H694.857143zM366.006857 21.430857A512.585143 512.585143 0 0 0 39.862857 313.782857h223.085714c17.92-117.467429 52.589714-222.573714 102.985143-292.352z m618.496 292.352A513.097143 513.097143 0 0 0 658.139429 21.430857c50.322286 69.778286 85.065143 174.811429 103.204571 292.352h223.085714zM247.881143 512c0-44.324571 2.486857-88.868571 6.802286-132.096H17.773714A514.998857 514.998857 0 0 0 0 512c0 45.787429 6.582857 89.819429 17.773714 132.096h236.617143a1417.069714 1417.069714 0 0 1-6.582857-132.096z m65.974857 0c0 45.860571 2.56 89.819429 6.875429 132.096h382.537142c4.388571-42.422857 6.875429-86.308571 6.875429-132.096 0-45.714286-2.486857-89.819429-6.875429-132.096h-382.537142c-4.388571 42.276571-6.875429 86.308571-6.875429 132.096z m692.516571-132.096h-236.763428c4.388571 43.373714 6.875429 87.771429 6.875428 132.096 0 44.324571-2.56 88.868571-6.875428 132.096h236.617143c11.337143-42.422857 17.773714-86.308571 17.773714-132.096 0-45.714286-6.436571-89.819429-17.627429-132.096zM658.285714 1002.422857a513.755429 513.755429 0 0 0 326.290286-292.352h-223.158857c-18.212571 117.613714-52.736 222.72-103.131429 292.352zM39.862857 710.217143a513.097143 513.097143 0 0 0 326.363429 292.352c-50.468571-69.778286-85.138286-174.811429-103.277715-292.352H39.862857z m289.499429 0C359.350857 894.537143 430.08 1024 512.146286 1024 594.285714 1024 664.868571 894.537143 694.857143 710.217143H329.362286z"
                  p-id="2147"></path>
              </svg> -->
            </a>
          </div>
        </div>
        <div class="popup-btn"></div>
      </div>
    </div>
  </div>
</template>
<style>
/* 置頂輪播文字 */
@keyframes announcement__scroll-up {

  0%,
  28% {
    transform: translateY(-0%);
  }

  34%,
  62% {
    transform: translateY(-25%);
  }

  68%,
  96% {
    transform: translateY(-50%);
  }

  100% {
    transform: translateY(-75%);
  }
}

.announcement__slider--animation {
  animation: announcement__scroll-up 18s linear infinite;
}

.announcement__slider {
  /* position: absolute;
  top: 0;
  left: 0; */
  width: 100%;
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-auto-rows: 1fr;
  background-color: #baa38f;
}
</style>
<style scoped lang="sass">
a
  color: #101010
  text-decoration: none
ul
  list-style: none
  padding: 0
  margin: 0
.dark
  background-color: #14171a !important
  color: #fff !important
  .menu-thumb,a
    color: rgba(255,255,255, 0.6) !important
    transition: all 0.2s ease-in-out
    &:hover
      color: rgba(255,255,255, 0.9) !important
.opaque
  background: #FFFFFF
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  .header-logo
    display: none !important
  .logo
    display: block !important
  .header .menu-btn
    min-width: 4.0625rem !important
    .icon,.edit-icons
      fill: #111 !important
      color: #111 !important
    .edit-icons
      fill: #11111199 !important
      &:hover
        fill: #111 !important
    .menu-log
      border: 1px solid #333 !important
      &:hover
        border: 1px solid #7354ff !important
    .menu-login
      border: 1px solid #7354ff !important
      &:hover
        background: #7354ff
        color: #fff !important
  .sl-menu-panel-toggle
    background: #cccccc33
.absolute
  position: absolute
  z-index: 9
.top
  top: -100%
header
  position: fixed
  z-index: 66
  color: #111
  top: 0
  left: 0
  right: 0
  width: 100%
  font-size: 1rem
  transition: all 0.3s ease-in-out
  .header-bulletin
    background: #baa38f
    font-size: 14px
    height: 45px !important
    overflow: hidden !important
    h4
      font-size: 14px
      line-height: 25px
      padding: 10px 20px
      text-align: center
  .header-nav
    padding: 10px 20px 0
    width: 1360px
    margin: 0 auto
    display: flex
    align-items: center
    .nav
      flex: 1
    .header-tool
      display: flex
      justify-content: flex-end
      align-items: center
      margin-bottom: 10px
      .tools
        display: flex
        align-items: center
        gap: 25px
        .t-item
          position: relative
          cursor: pointer
          .purchase-volume
            position: absolute
            top: -5px
            right: -10px
            width: 18px
            height: 18px
            border-radius: 50%
            background: #baa38f
            color: white
            text-align: center
            z-index: 1
            font-size: 11px
            line-height: 18px
          .icon
            width: 18px
            height: 18px
            fill: #333
            &:hover
              fill: #555
          .sele-mask
            position: fixed
            top: 0
            left: 0
            width: 100vw
            height: 100vh
            z-index: 99
            display: flex
            justify-content: center
            align-items: center
            transition: all 0.1s ease
          .t-item-sele
            position: absolute
            top: calc(100% + 15px)
            z-index: 101
            left: 50%
            transform: translateX(-50%)
            font-size: 14px
            ul
              background: #fff
              position: relative
              z-index: 101
              padding: 15px 3px
              border: 1px solid #ddd
              border-radius: 5px
              li
                white-space: nowrap
                padding: 5px 10px
                cursor: pointer
                &:hover
                  color: #bbb
          .sl-menu-panel-toggle
            height: 65px
            width: 65px
            display: none
            align-items: center
            justify-content: center

            i
              width: 36%
              height: 2px
              background: #000
              box-shadow: 0 0 0 1px #fff
              border-radius: 1px
              position: relative
              &::before
                content: ""
                position: absolute
                top: -6px
                width: 100%
                height: 2px
                background: #000
                box-shadow: 0 0 0 1px #fff
                border-radius: 1px
              &::after
                content: ""
                position: absolute
                bottom: -6px
                width: 100%
                height: 2px
                background: #000
                box-shadow: 0 0 0 1px #fff
                border-radius: 1px
          .search
            display: flex
            align-items: center
            input
              padding: 1px 2px
              font-size: 14px
              width: 110px
              background: none
              border-block-end: 1px solid #111
              &::placeholder
                color: #444
    .header-logo
      display: flex
      justify-content: center
      img
        width: 100px
        margin: -27px 0 0
  .logo
    display: none
    height: 100%
    width: 70px
    height: 70px
    max-height: 4.0625rem
    img
      height: 100%
  .header
    display: flex
    align-items: center
    justify-content: space-between
    margin: 0 auto
    padding: 10px
    ul.menu
      flex-grow: 1
      list-style: none
      padding: 0
      margin: 0
      display: flex
      justify-content: center
      font-size: 15px
      &>li
        position: relative
        margin-inline: 1rem
        display: flex
        .icon-touch
          display: none
        &:hover
          color: #baa38f
          &>a
            color: #baa38f
          .submenu
            opacity: 1
            visibility: visible
          .icon-touch
            display: block
          .icon-aloof
            display: none
        &>a
          display: flex
          align-items: center
          margin-bottom: 15px
          gap:2px
          .icon
            width: 12px
        .submenu
          position: absolute
          top: 100%
          left: 0
          display: grid
          opacity: 0
          visibility: hidden
          grid-template-columns: 1fr
          background: #fff
          transition: all .3s ease-in-out
          box-shadow: 8px 8px 8px 0 rgba(0,0,0,0.03),-2px 8px 8px 0 rgba(0,0,0,0.03)
          color: #111
          width: 200px
          li
            flex: 1 1 auto
            padding-inline: 16px
            padding-block: 12px
            a
              display: flex
              flex-direction: column
              align-items: flex-start
              justify-content: center
              &:hover
                color: #baa38f
              img
                margin-inline: 3rem
                width: 49px
                height: 49px
              span
                margin-block-start: 8px
          .solid-right
            border-right: 1px solid #ccc
          .solid-bottom
            border-bottom: 1px solid #ccc
        @media (max-width: 1200px)
          display: none

    .menu-btn
      min-width: 4.0625rem
      display: flex
      justify-content: flex-end
      align-items: center
      gap: .5rem
      .icon
        fill:#ffffff
        width: 24px
        height: 24px
        cursor: pointer
        display: none
        @media (max-width: 1200px)
          display: block
      .edit-icons
        fill: #ffffff99
        cursor: pointer
        width: 1.2rem
        height: 1.2rem
        transition: all 0.3s ease-in-out
        &:hover
          fill: #fff
        @media (max-width: 1200px)
          display: none
      .menu-acc
        display: flex
        align-items: center
        //@media (max-width: 1200px)
          //display: none
        .user-con
          transition: all 0.3s ease-in-out
          margin-inline-end: 1rem
          font-size: .8rem
          .account
            color: #7354ff
        .menu-log
          padding: .2rem .8rem
          transition: all 0.3s ease-in-out
          border: 1px solid #ffffff00
          border-radius: 5px
          &:hover
            color: #7354ff
            border: 1px solid #7354ff
        .menu-login
          color: #7354ff
          border: 1px solid #7354ff
          &:hover
            background: #7354ff
            color: #fff !important
        .menu-logout
          color: #7354ff
          border: 1px solid #7354ff
          @media (max-width: 1200px)
            display: none
          &:hover
            background: #7354ff
            color: #fff !important
.popup-wrapper
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.2)
  z-index: 100
  display: flex
  justify-content: center
  align-items: center
  transition: all 0.1s ease
  @media (min-width: 1200px)
    display: none
  .popup-content
    overflow-y: scroll
    position: absolute
    top: 0
    left: 0
    background-color: #fff
    width: 75%
    height: 100%
    transform: translateX(-100%)
    transition: all 0.2s ease
    .popup-title
      display: flex
      justify-content: space-between
      align-items: center
      padding-block-start: 1rem
      &>span
        margin-left: 15px
      img
        width: 1rem
        height: 1rem
        margin-inline: 1rem
        cursor: pointer
    .popup-btn
        padding: 20px
    .popup-menus
      .mobi-add
        border-top: 1px solid rgba(0,0,0, 0.1)
        h3
          padding: 25px 15px 11px
          font-size: 1.25rem
          color: #999
        a
          font-size: .9rem
          display: flex
          align-items: center
          padding: 15px
          justify-content: space-between
      .t-item-sele
        ul
          display: flex
          border-radius: 8px
          border: 1px solid rgba(0,0,0, 0.1)
          overflow: hidden
          li
            padding: 8px 15px
            transition: all .2s ease-in-out
            &:hover
              background: rgba(0,0,0, 0.05)
          .sele-active
            color: #fff
            background: #baa38f !important
            
      .menus
        list-style: none
        padding: 20px 0 0
        margin-block-end: 1.5625rem
        &>li
          margin-inline: 15px
          cursor: pointer
          // border-block-end: 1px solid #ccc
          color: #11111199
          min-height: 50px
          overflow: hidden
          transition: all 0.5s ease-in-out
          font-size: .9rem

          &>a
            display: flex
            justify-content: space-between
            align-items: center
            text-decoration: none
            height: 40px
            transition: all .2s
            &:hover
              color: #000
            .icon
              width: .7rem
              height: .7rem
              transition: all 0.2s ease-in-out
          .submenu
            max-height: 0
            overflow: hidden
            transition: all 0.4s ease-in-out
            ul>li
              height: 40px
              line-height: 40px
              padding-inline: 15px
              &:hover
                color: #333333
        .has-dropdown
          &:hover
            .submenu
              max-height: 999px !important
            a .icon
              transform: rotate(180deg) !important
  .cont-left
    transform: translateX(0%)
.show-mobi
  display: none
</style>
<style lang="sass">
// 響應式控制
@media (max-width: 1360px)
  header .header-nav
    width: 100% !important
@media (max-width: 1200px)
  header .header-nav
    padding:0 0 0 20px !important
  .header-logo
    display: none !important
  .header-tool
    margin-bottom: 0 !important
  .header
    display: none !important
  header .logo
    display: block !important
  .sl-menu-panel-toggle
    display: flex !important
  .hide-mobi
    display: none !important
  .header-mask
    position: fixed !important
    top: 45px !important
    left: 0 !important
    height: 100vh !important
    width: 100vw !important
    z-index: 0 !important
    background: rgba(0, 0, 0, 0.5)
  .search-input-mobi
    background: #fff !important
    padding: 20px 20px !important
    position: fixed !important
    display: flex !important
    align-items: center !important
    top: 45px !important
    left: 0 !important
    width: 100% !important
    z-index: 8 !important
    input
      width: 100% !important
    .show-mobi
      display: block !important

@media (max-width: 768px)
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
    opacity: 1 !important
  // 聯絡我們
  .popup-contact
    padding: 0 15px 
    .modal-body
      width: 90%
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
  opacity: 0
  background: #ffffff
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  border: 1px solid #f7f7f7
  transition: all 0.5s ease-in-out
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
  opacity: 1 !important

// 聯絡我們
.popup-contact
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100dvh
  background: rgba(0, 0, 0, .4)
  z-index: 101
  transition: all .2s ease
.modal-body
  position: absolute
  top: -100%
  left: 50%
  opacity: 0
  transform: translate(-50%, -50%) 
  
  margin: 30px auto
  background-color: #fff
  color: #1f2937
  padding: 15px
  border-radius: 6px
  transition: all 0s ease-in-out
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5)
  .message-shop
    .message-title
      font-size: 14px
      color: #5d5d5d
    .contact-info
      .form-group
        .controls
          .form-control
            padding: 6px 12px
            width: 100%
            background: #fff
            color: #555555
            border: 1px solid #dcdcdc
            border-radius: 4px
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075)
            font-size: 14px
            line-height: 24px
          .text-area
            height: 100px
            resize: none
        .help-block
          color: #a94442
          margin-top: 5px
          font-size: 12px
        .hide
          display: none
      .sub-btn
        padding: 6px 12px
        background: #baa38f
        text-align: center
        border-radius: 3px
        color: #fff
        font-size: 14px
        line-height: 20px
        width: 100px
        border: 1px solid #baa38f
.modal-body-active
  width: 600px
  opacity: 1 !important
  top: 40% !important
  left: 50% !important
  transform: translate(-50%, -50%) !important
  transition: all 0.3s ease
</style>
