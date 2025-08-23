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
  }, 1200)
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
      id: 4
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
  if (searchVal.value.length == 0) {
    onMask()
    return
  }
  ElMessage({
    message: searchVal.value,
    type: 'success'
  })
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
          <!-- <img :src="siteStore.siteData?.logo" alt="logo" /> -->
          <img src="/assets/images/WY.png" alt="logo" />
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
                    <div style="padding: 0 10px 10px;" v-if="isLogin()"> {{ '用戶6515616' }}</div>
                    <li v-if="isLogin()">{{ $lang('地址管理') }}</li>
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
              <li class="has-dropdown active menu-thumb">
                <a>
                  <span>WINYI 當月活動</span>
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
                      <a href="">WINYI 浪漫七夕．探索無限快感</a>
                    </li>
                    <li>
                      <a href="">2025 斷捨離｜情趣玩具汰舊換新 </a>
                    </li>
                    <li>
                      <a href="">會員福利｜每月15號會員日 </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="has-dropdown active menu-thumb">
                <a>
                  <span>新品上市</span>
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
                      <a href="">Andy 歐熊雙環震動鎖精環</a>
                    </li>
                    <li>
                      <a href=""> Quinn 海王雙頭震動吸吮器 </a>
                    </li>
                    <li>
                      <a href=""> PINGU 企鵝寶寶換頭吸吮按摩器 </a>
                    </li>
                    <li>
                      <a href=""> TIFFANY 冰藍海豚旋轉伸縮按摩棒 </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a @click="navigateTo('/productcategories')">所有商品</a>
              </li>
              <li>
                <a> 情侶情趣用品專區 </a>
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
                  <span>情趣周邊</span>
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
                      <a href=""> BDSM項圈 </a>
                    </li>
                    <li>
                      <a href=""> 潤滑液／口交液 </a>
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
                      <a href=""> Ｗ專欄 </a>
                    </li>
                    <li>
                      <a href=""> 小編來開箱 </a>
                    </li>
                    <li>
                      <a href=""> KOL 好評推薦 </a>
                    </li>
                    <li>
                      <a href=""> YT 評測分享 </a>
                    </li>
                    <li>
                      <a href=""> 情慾探索工作坊 </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a @click="navigateTo('/game')">{{ $lang('常見問答') }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <!-- 購物車彈出 -->
    <div :class="showShoppingCart ? 'shopping-cart-container' : ''" @click.self="onShoppingCart">
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
    </div>
    <!-- 聯係我們彈出 -->
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
            <li class="has-dropdown menu-thumb">
              <a>
                <span>WINYI 當月活動</span>
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
                    <a href="">WINYI 浪漫七夕．探索無限快感</a>
                  </li>
                  <li>
                    <a href="">2025 斷捨離｜情趣玩具汰舊換新 </a>
                  </li>
                  <li>
                    <a href="">會員福利｜每月15號會員日 </a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="has-dropdown menu-thumb">
              <a>
                <span>新品上市</span>
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
                    <a href="">Andy 歐熊雙環震動鎖精環</a>
                  </li>
                  <li>
                    <a href=""> Quinn 海王雙頭震動吸吮器 </a>
                  </li>
                  <li>
                    <a href=""> PINGU 企鵝寶寶換頭吸吮按摩器 </a>
                  </li>
                  <li>
                    <a href=""> TIFFANY 冰藍海豚旋轉伸縮按摩棒 </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a @click="navigateTo('/productcategories')">所有商品</a>
            </li>
            <li>
              <a :href="siteStore.chatbox" target="_blank">
                情侶情趣用品專區
              </a>
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
                <span>情趣周邊</span>
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
                    <a href=""> BDSM項圈 </a>
                  </li>
                  <li>
                    <a href=""> 潤滑液／口交液 </a>
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
                    <a href=""> Ｗ專欄 </a>
                  </li>
                  <li>
                    <a href=""> 小編來開箱 </a>
                  </li>
                  <li>
                    <a href=""> KOL 好評推薦 </a>
                  </li>
                  <li>
                    <a href=""> YT 評測分享 </a>
                  </li>
                  <li>
                    <a href=""> 情慾探索工作坊 </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a @click="">{{ $lang('常見問答') }}</a>
            </li>
          </ul>
          <div class="mobi-add">
            <h3>{{ $lang('帳戶') }}</h3>
            <a @click="navigateTo('/login')" v-if="!isLogin()">{{ $lang('會員登入') }}</a>
            <a @click="navigateTo('/register')" v-if="!isLogin()">{{ $lang('新用戶注冊') }}</a>
            <a v-if="isLogin()"> {{ '用戶6515616' }}</a>
            <a v-if="isLogin()"> {{ $lang('地址管理') }} </a>
            <a v-if="isLogin()" @click="signout">{{ $lang('登出') }}</a>
          </div>
          <div class="mobi-add">
            <h3>{{ $lang('其他') }}</h3>
            <a @click="onShowMessage">
              <span>{{ $lang('聯係我們') }}</span>
              <svg t="1755263638627" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="1347" width="20" height="20">
                <path
                  d="M823.135226 106.515942 195.565071 106.515942c-71.733765 0-130.09087 63.59848-130.09087 141.771911l0 402.309762c0 78.171384 58.358129 141.769864 130.09087 141.769864l20.697391 0L216.262462 898.128221c0 31.728632 23.611767 57.547671 52.629661 57.547671 10.321066 0 20.581758-3.5038 29.436426-9.965979l216.755696-153.341411 308.055075 0c71.731718 0 130.09087-63.59848 130.09087-141.769864L953.23019 248.288876C953.225073 170.114422 894.867968 106.515942 823.135226 106.515942L823.135226 106.515942zM332.590887 407.282007c21.366633 0 38.688137 18.877953 38.688137 42.163285 0 23.283286-17.321504 42.162262-38.688137 42.162262-21.36254 0-38.689161-18.877953-38.689161-42.162262C293.900703 426.15996 311.228347 407.282007 332.590887 407.282007L332.590887 407.282007zM509.351684 491.607554c-21.366633 0-38.689161-18.877953-38.689161-42.162262 0-23.285333 17.322527-42.163285 38.689161-42.163285 21.36561 0 38.683021 18.877953 38.683021 42.163285C548.034704 472.729601 530.717294 491.607554 509.351684 491.607554L509.351684 491.607554zM686.10941 491.607554c-21.366633 0-38.689161-18.877953-38.689161-42.162262 0-23.285333 17.322527-42.163285 38.689161-42.163285 21.36561 0 38.688137 18.877953 38.688137 42.163285C724.797547 472.729601 707.47502 491.607554 686.10941 491.607554L686.10941 491.607554zM686.10941 491.607554"
                  p-id="1348"></path>
              </svg>
            </a>
            <a>
              <div class="t-item-sele">
                <ul>
                  <!-- <li>English</li> -->
                  <li>繁体中文</li>
                </ul>
              </div>
              <svg t="1755263678337" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2146" width="20" height="20">
                <path
                  d="M694.857143 313.782857C665.014857 129.462857 594.358857 0 512.219429 0 430.08 0 359.350857 129.462857 329.435429 313.782857H694.857143zM366.006857 21.430857A512.585143 512.585143 0 0 0 39.862857 313.782857h223.085714c17.92-117.467429 52.589714-222.573714 102.985143-292.352z m618.496 292.352A513.097143 513.097143 0 0 0 658.139429 21.430857c50.322286 69.778286 85.065143 174.811429 103.204571 292.352h223.085714zM247.881143 512c0-44.324571 2.486857-88.868571 6.802286-132.096H17.773714A514.998857 514.998857 0 0 0 0 512c0 45.787429 6.582857 89.819429 17.773714 132.096h236.617143a1417.069714 1417.069714 0 0 1-6.582857-132.096z m65.974857 0c0 45.860571 2.56 89.819429 6.875429 132.096h382.537142c4.388571-42.422857 6.875429-86.308571 6.875429-132.096 0-45.714286-2.486857-89.819429-6.875429-132.096h-382.537142c-4.388571 42.276571-6.875429 86.308571-6.875429 132.096z m692.516571-132.096h-236.763428c4.388571 43.373714 6.875429 87.771429 6.875428 132.096 0 44.324571-2.56 88.868571-6.875428 132.096h236.617143c11.337143-42.422857 17.773714-86.308571 17.773714-132.096 0-45.714286-6.436571-89.819429-17.627429-132.096zM658.285714 1002.422857a513.755429 513.755429 0 0 0 326.290286-292.352h-223.158857c-18.212571 117.613714-52.736 222.72-103.131429 292.352zM39.862857 710.217143a513.097143 513.097143 0 0 0 326.363429 292.352c-50.468571-69.778286-85.138286-174.811429-103.277715-292.352H39.862857z m289.499429 0C359.350857 894.537143 430.08 1024 512.146286 1024 594.285714 1024 664.868571 894.537143 694.857143 710.217143H329.362286z"
                  p-id="2147"></path>
              </svg>
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
  position: absolute;
  top: 0;
  left: 0;
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
          display: flex
          align-items: center
          padding: 15px
          justify-content: space-between
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
