<script lang="ts" setup>
const siteStore = useSiteStore()
const { isLogin, signout } = useAuthStore()
const PlayerStore = usePlayerStore()
const emit = defineEmits(['onPopupState'])
const props = defineProps({
  opaque: { type: Boolean, default: false },
  absolute: { type: Boolean, default: false },
  top: { type: Boolean, default: false },
  menu: { type: Boolean, default: true },
  styles: { type: String, default: '' },
  routerCrt: { type: String, default: '/' },
  headerW100: { type: String, default: '' }
})
const playerWalletBalance = computed(() => {
  if (!isLogin()) {
    return 0
  }
  console.log(PlayerStore.playerInfo, 'PlayerStore.playerInfo')

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
</script>
<template>
  <div>
    <header
      :class="{
        opaque: props.opaque,
        absolute: absolute,
        top: top
      }"
      :style="styles"
    >
      <div class="header" :style="headerW100">
        <div class="logo" @click="navigateTo('/')">
          <img :src="siteStore.siteData?.logo" alt="logo" />
        </div>
        <ul class="menu" v-if="menu">
          <li class="has-dropdown active menu-thumb">
            <a @click="navigateTo('/')">首頁</a>
          </li>
          <li class="has-dropdown active menu-thumb">
            <a @click="navigateTo('/about')"> 關於我們 </a>
          </li>
          <li>
            <a @click="navigateTo('/service')">我們的服務</a>
          </li>
          <li>
            <a :href="siteStore.chatbox" target="_blank"> 聯絡我們 </a>
          </li>
          <li>
            <a @click="navigateTo('/user/info')"> 會員中心 </a>
          </li>
          <li v-if="isLogin()">
            <a @click="navigateTo('/game')">互動平臺</a>
          </li>
        </ul>
        <ul class="menu" v-if="!menu">
          <li class="has-dropdown active menu-thumb">
            <a
              @click="navigateTo('/game')"
              :style="{ color: routerCrt == '/' ? '#7354ff' : '' }"
              >首頁</a
            >
          </li>
          <li class="has-dropdown active menu-thumb">
            <a
              @click="navigateTo('/game/cointrading')"
              :style="{
                color: routerCrt == '/game/cointrading' ? '#7354ff' : ''
              }"
            >
              幣幣交易
            </a>
          </li>
          <li>
            <a
              @click="navigateTo('/game/perpetualcontract')"
              :style="{
                color: routerCrt == '/game/perpetualcontract' ? '#7354ff' : ''
              }"
              >永續合約</a
            >
          </li>
          <li>
            <a :href="siteStore.chatbox" target="_blank"> 聯絡我們 </a>
          </li>
        </ul>
        <div class="menu-btn">
          <div class="menu-acc">
            <div class="user-con" v-if="isLogin() && menu">
              <div class="account">{{ PlayerStore.playerInfo?.account }}</div>
              <div class="account">NT ${{ playerWalletBalance || '0' }}</div>
            </div>
            <div class="user-con" v-if="isLogin() && !menu">
              <div class="account">{{ PlayerStore.playerInfo?.account }}</div>
            </div>
            <a
              v-if="!isLogin()"
              @click="navigateTo('/login')"
              title="登入"
              class="menu-log menu-login"
            >
              Login
            </a>
            <a
              v-if="isLogin()"
              title="登出"
              @click="signout"
              class="menu-log menu-logout"
            >
              Logout
            </a>
          </div>
          <svg
            t="1746111079798"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2333"
            @click="onPopup"
          >
            <path
              d="M50 203.7h924.1c27.6 0 50-22.3 50-50 0-27.6-22.3-50-50-50H50c-27.6 0-50 22.3-50 50 0.1 27.7 22.4 50 50 50z m924.1 257.9H50c-27.6 0-50 22.3-50 50 0 27.6 22.3 50 50 50h924.1c27.6 0 50-22.3 50-50s-22.4-50-50-50z m0 357.8H50c-27.6 0-50 22.3-50 50 0 27.6 22.3 50 50 50h924.1c27.6 0 50-22.3 50-50s-22.4-50-50-50z m0 0"
              p-id="2334"
            ></path>
          </svg>
        </div>
      </div>
    </header>
    <!-- popup -->
    <div v-show="isShw" class="popup-wrapper" @click.self="onClose">
      <div
        class="popup-content"
        :class="{
          'cont-left': isCont,
          dark:
            routerCrt == '/game/cointrading' ||
            routerCrt == '/game/perpetualcontract'
        }"
        @click.stop=""
      >
        <div class="popup-title">
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
            alt=""
            @click="onClose"
          />
        </div>
        <div class="popup-menus">
          <ul class="menus" v-if="menu">
            <li class="menu-thumb">
              <a @click="navigateTo('/')">
                <span>首頁</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('/about')"> 關於我們 </a>
            </li>
            <li>
              <a @click="navigateTo('/service')">我們的服務</a>
            </li>
            <li>
              <a :href="siteStore.chatbox" target="_blank"> 聯絡我們 </a>
            </li>

            <li>
              <a @click="navigateTo('/user/info')"> 會員中心 </a>
            </li>
            <li v-if="isLogin()" class="menu-thumb">
              <a @click="navigateTo('/game')">
                <span>互動平臺</span>
              </a>
            </li>

            <li v-if="isLogin()">
              <a class="logout" @click="signout">Logout</a>
            </li>
          </ul>
          <ul class="menus" v-if="!menu">
            <li class="has-dropdown menu-thumb">
              <a
                @click="navigateTo('/game')"
                :style="{ color: routerCrt == '/' ? '#7354ff !important' : '' }"
                >首頁</a
              >
            </li>
            <li class="has-dropdown menu-thumb">
              <a
                @click="navigateTo('/game/cointrading')"
                :style="{
                  color:
                    routerCrt == '/game/cointrading' ? '#7354ff !important' : ''
                }"
              >
                幣幣交易
              </a>
            </li>
            <li>
              <a
                @click="navigateTo('/game/perpetualcontract')"
                :style="{
                  color:
                    routerCrt == '/game/perpetualcontract'
                      ? '#7354ff !important'
                      : ''
                }"
                >永續合約</a
              >
            </li>
            <li>
              <a :href="siteStore.chatbox" target="_blank"> 聯絡我們 </a>
            </li>
            <li v-if="isLogin()">
              <a class="logout" @click="signout">Logout</a>
            </li>
          </ul>
        </div>
        <div class="popup-btn"></div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="sass">
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
  color: #111
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
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
.absolute
  position: absolute
  z-index: 9
.top
  top: -100%
header
  position: fixed
  z-index: 66
  color: #fff
  top: 0
  left: 0
  right: 0
  width: 100%
  font-size: 1rem
  transition: all 0.3s ease-in-out
  .header
    height: 74px
    display: flex
    align-items: center
    justify-content: space-between
    width: 1200px
    margin: 0 auto
    padding-block: 3px
    .logo
      height: 100%
      max-height: 4.0625rem
      img
        height: 100%
    @media (max-width: 1200px)
      width: 100%
      padding: 0 2rem
    ul.menu
      list-style: none
      padding: 0
      margin: 0
      display: flex
      &>li
        position: relative
        margin-inline-start: 2rem
        display: flex
        transition: all 0.3s ease-in-out
        &:hover
          color: #7354ff
        &>a
          height: 70px
          line-height: 70px
        .submenu
          position: absolute
          top: calc(100% + 1.5rem)
          left: 0
          display: grid
          opacity: 0
          visibility: hidden
          grid-template-columns: 1fr 1fr
          background: #fff
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
          color: #111
          padding: 1rem 1rem
          transition: all 0.5s ease-in-out
          li
            flex: 1 1 auto
            padding-inline: 1rem
            padding-block: 1rem
            a
              display: flex
              flex-direction: column
              align-items: center
              text-align: center
              justify-content: center
              transition: all 0.3s ease-in-out
              &:hover
                color: #7354ff
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
  @media (min-width: 1200px)
    display: none
  .popup-content
    overflow-y: scroll
    position: absolute
    top: 0
    background-color: #fff
    width: 100%
    transform: translateY(-100%)
    transition: all 0.3s ease-in-out
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
    .popup-menus
      .menus
        list-style: none
        padding: 20px 0 0
        margin-block-end: 1.5625rem
        &>li
          margin-inline: 15px
          cursor: pointer
          // border-block-end: 1px solid #ccc
          color: #11111199
          min-height: 40px
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
              width: 1.5rem
              height: 1.5rem
              transition: all 0.2s ease-in-out
          .submenu
            &>li
              height: 46px
              line-height: 46px
              padding-inline: 15px
              &:hover
                color: #333333
        .logout
          width: 100%
          border: 1px solid #ccc
          height: 46px
          line-height: 46px
          border-radius: .4rem
          margin-block: .8rem
          color: #7354ff99
          text-align: center
          justify-content: center
          font-size: 1.2rem
          transition: all 0.2s ease-in-out
          &:hover
            border: 1px solid #7354ff99
            background: #7354ff
            color: #fff
        .has-dropdown:hover
          max-height: 999px
          a .icon
            transform: rotate(180deg) !important
  .cont-left
    transform: translateX(0%)
</style>
