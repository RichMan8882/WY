<script lang="ts" setup>
const playerStore = usePlayerStore()
const siteStore = useSiteStore()
const { t } = useI18n()
const walletName = (type) => {
  switch (type) {
    case 1:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('美元資產(電子錢包)')
    case 2:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('電力資產(電子錢包)')
    case 3:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('商城資產(電子錢包)')
    case 4:
      return siteStore.siteData.mainWalletType === type
        ? t('我的資產(電子錢包)')
        : t('質押資產(電子錢包)')
    default:
      return t('其他資產')
  }
}
const { updatePassword, updateTrasactionPassword } = usePlayerStore()
const pwd = ref({
  oPwd: '',
  nPwd: '',
  nPwdConfirm: '',
  showoPwd: false,
  shownPwd: false,
  shownPwdConfirm: false
})
const transactionPwd = ref({
  oPwd: '',
  nPwd: '',
  nPwdConfirm: '',
  showoPwd: false,
  shownPwd: false,
  shownPwdConfirm: false
})
const changePwd = ref(false)
const changenTPwd = ref(false)
// updatePassword()  更新密碼
// updateTrasactionPassword()  更新交易密碼
watch(
  () => pwd.value.nPwdConfirm,
  (val) => {
    console.log(val, 'casas')

    if (val) {
      changePwd.value = true
    } else {
      changePwd.value = false
    }
  }
)
watch(
  () => transactionPwd.value.nPwdConfirm,
  (val) => {
    if (val) {
      changenTPwd.value = true
    } else {
      changenTPwd.value = false
    }
  }
)
const sendPasswordChange = async (type: number) => {
  console.log('changePwd.value', changePwd.value)
  console.log('changenTPwd.value', changenTPwd.value)
  if (changePwd.value && type == 1) {
    if (pwd.value.nPwd !== pwd.value.nPwdConfirm) {
      ElNotification({
        title: `${t('密碼不一致')}`,
        type: 'error',
        duration: 1000,
        showClose: false
      })
      return
    }
    const res = await updatePassword({
      password: pwd.value.oPwd,
      newPassword: pwd.value.nPwd
    })
    if (res.success) {
      pwd.value.oPwd = ''
      pwd.value.nPwd = ''
      pwd.value.nPwdConfirm = ''
    }
  }
  if (changenTPwd.value && type == 2) {
    if (transactionPwd.value.nPwd !== transactionPwd.value.nPwdConfirm) {
      ElNotification({
        title: `${t('交易密碼不一致')}`,
        type: 'error',
        duration: 1000,
        showClose: false
      })
      return
    }
    const res = await updateTrasactionPassword({
      password: transactionPwd.value.oPwd,
      newPassword: transactionPwd.value.nPwd
    })
    if (res.success) {
      transactionPwd.value.oPwd = ''
      transactionPwd.value.nPwd = ''
      transactionPwd.value.nPwdConfirm = ''
    }
  }
}

const scrollTop = ref(0)
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
    <headerTop :opaque="scrollTop >= 0"></headerTop>
    <div class="user-info">
      <div class="user-info-block">
        <div class="user-title">
          <span>{{ playerStore.playerInfo.username }}</span>
        </div>
        <div class="user-account">
          <span>帳號 {{ playerStore.playerInfo.account }}</span>
        </div>
        <div class="user-line">
          <img v-if="playerStore.playerInfo.social.platform == 'line'" src="@/assets/images/line.png" alt="">
          <img v-if="playerStore.playerInfo.social.platform == 'facebook'" src="@/assets/images/facebook.png" alt="">
          <span
            v-if="playerStore.playerInfo.social.platform != 'line' && playerStore.playerInfo.social.platform != 'facebook'">
            {{ playerStore.playerInfo.social.platform }}
          </span>
          <span>{{ playerStore.playerInfo.social.id }}</span>
        </div>
        <div class="user-line">
          <svg t="1756275787888" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="12835" width="28" height="28">
            <path
              d="M0 0m204.8 0l614.4 0q204.8 0 204.8 204.8l0 614.4q0 204.8-204.8 204.8l-614.4 0q-204.8 0-204.8-204.8l0-614.4q0-204.8 204.8-204.8Z"
              fill="#d4237a" opacity=".2" p-id="12836"></path>
            <path
              d="M318.532267 731.2384a69.973333 69.973333 0 0 1-51.541334-20.616533l-17.169066-17.169067a93.354667 93.354667 0 0 1 0-133.9904 75.451733 75.451733 0 0 1 65.28-30.8736 93.866667 93.866667 0 0 1 65.28 27.477333 444.945067 444.945067 0 0 0 120.251733-120.251733 93.354667 93.354667 0 0 1 0-133.9904 95.931733 95.931733 0 0 1 68.693333-27.528533 102.144 102.144 0 0 1 68.7104 27.477333l13.738667 13.738667 3.413333 3.413333c54.971733 54.971733-13.738667 185.531733-109.943466 281.719467-79.018667 75.588267-168.3456 130.56-226.747734 130.56z"
              fill="#d4237a" p-id="12837"></path>
            <path
              d="M291.037867 683.144533a39.0144 39.0144 0 0 0 27.477333 10.24c41.233067 0 120.251733-37.7856 202.7008-116.804266 96.221867-96.1536 137.403733-202.6496 109.960533-230.144l-3.413333-3.413334-13.738667-13.738666a60.023467 60.023467 0 0 0-85.896533 0 58.180267 58.180267 0 0 0 0 79.018666 3.413333 3.413333 0 0 1 3.413333 3.413334c3.413333 0 3.413333 3.413333 6.826667 3.413333l13.738667 10.24-10.24 13.738667a579.208533 579.208533 0 0 1-68.7104 85.896533 538.231467 538.231467 0 0 1-85.896534 68.8128l-13.738666 10.24-10.24-13.738667c0-3.413333-3.413333-3.413333-3.413334-6.826666a3.413333 3.413333 0 0 0-3.413333-3.413334 59.101867 59.101867 0 0 0-82.449067 3.413334 62.6688 62.6688 0 0 0 0 82.449066z"
              fill="#d4237a" p-id="12838"></path>
            <path
              d="M359.765333 397.9776a16.2304 16.2304 0 0 1-17.186133-17.186133 117.896533 117.896533 0 0 1 61.8496-120.251734 14.762667 14.762667 0 0 1 24.046933 6.826667c3.413333 10.24 3.413333 20.616533-6.826666 24.046933a91.682133 91.682133 0 0 0-44.714667 85.947734 17.2032 17.2032 0 0 1-17.186133 20.616533z"
              fill="#d4237a" p-id="12839"></path>
            <path
              d="M583.082667 686.574933a16.2304 16.2304 0 0 1-17.186134-17.186133 19.234133 19.234133 0 0 1 17.186134-20.616533 63.709867 63.709867 0 0 0 48.093866-44.663467 19.592533 19.592533 0 1 1 37.7856 10.24c-17.186133 37.7856-48.093867 68.7104-85.896533 72.1408z"
              fill="#d4237a" p-id="12840"></path>
            <path
              d="M607.1296 775.901867a16.2304 16.2304 0 0 1-17.186133-17.186134 19.234133 19.234133 0 0 1 17.186133-20.616533 134.058667 134.058667 0 0 0 103.0656-96.2048 19.592533 19.592533 0 0 1 37.7856 10.24 183.7568 183.7568 0 0 1-140.868267 123.682133z m-347.016533-384.802134a18.397867 18.397867 0 0 1-17.169067-17.169066 201.233067 201.233067 0 0 1 109.943467-188.962134 17.749333 17.749333 0 0 1 24.046933 10.24 17.749333 17.749333 0 0 1-10.24 24.046934 160.648533 160.648533 0 0 0-85.9648 154.6752 19.319467 19.319467 0 0 1-20.616533 17.186133z"
              fill="#d4237a" p-id="12841"></path>
          </svg>
          <span>{{ playerStore.playerInfo.countryCode }}
            {{ playerStore.playerInfo.mobile | maskMobile }}</span>
        </div>

        <div class="user-line edit-nav" @click="navigateTo('/address')">
          <svg t="1756276482411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="17221" width="28" height="28">
            <path
              d="M488.163105 454.695876c0 40.981367 33.468253 74.205049 74.751494 74.205049 41.284265 0 74.752518-33.222659 74.752518-74.205049 0-40.98239-33.468253-74.206072-74.752518-74.206072C521.631358 380.489804 488.163105 413.713486 488.163105 454.695876L488.163105 454.695876 488.163105 454.695876zM488.163105 454.695876"
              p-id="17222" fill="#d4237a"></path>
            <path
              d="M264.015046 79.124082c-55.19509 0-99.773378 44.275389-99.773378 98.892311l0 74.260308-63.936171 0c-20.880563 0-37.899168 16.902972-37.899168 37.753859 0 20.996197 16.966417 37.754882 37.899168 37.754882l63.936171 0 0 72.901357-63.936171 0c-20.880563 0-37.899168 16.902972-37.899168 37.754882 0 20.999266 16.966417 37.753859 37.899168 37.753859l63.936171 0 0 72.907497-63.936171 0c-20.880563 0-37.899168 16.902972-37.899168 37.753859 0 20.996197 16.966417 37.754882 37.899168 37.754882l63.936171 0 0 72.906473 0 75.508741 0 72.955592c0 54.766324 44.669362 98.893334 99.773378 98.893334l597.803201 0c55.196113 0 99.774401-44.276413 99.774401-98.893334L961.592648 178.016393c0-54.769394-44.673455-98.892311-99.774401-98.892311L264.015046 79.124082 264.015046 79.124082zM562.9146 726.789924c-30.964222 0-149.502989-154.216337-149.502989-272.094048 0-117.877711 77.316923-157.485801 149.502989-157.485801 72.187089 0 149.504012 37.253462 149.504012 157.485801S593.878822 726.789924 562.9146 726.789924L562.9146 726.789924 562.9146 726.789924zM562.9146 726.789924"
              p-id="17223" fill="#d4237a"></path>
          </svg>
          <span>默認收貨地址: <br /> {{ '福建省 廈門市 湖裏區 海上世界星巴克' }}</span>

          <svg t="1756277399813" class="edit-icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="18724" width="20" height="20">
            <path
              d="M846.9 511.7v279.9c0 33.6-22.4 56-56 56H231.2c-33.6 0-56-22.4-56-56V231.8c0-33.6 22.4-56 56-56h279.9c33.6 0 56-22.4 56-56s-22.4-56-56-56H231.2c-95.2 0-167.9 72.8-167.9 167.9v559.8c0 95.2 72.8 167.9 167.9 167.9H791c95.2 0 167.9-72.8 167.9-167.9V511.7c0-33.6-22.4-56-56-56s-56 22.4-56 56z m-459 67.2c-22.4-22.4-22.4-56 0-78.4L785.4 103c22.4-22.4 56-22.4 78.4 0 22.4 22.4 22.4 56 0 78.4L466.3 578.9c-22.4 22.4-61.6 22.4-78.4 0z m0 0"
              p-id="18725"></path>
          </svg>
        </div>
      </div>
      <div class="w-full">
        <label style="font-size: 17px; color: #000; font-weight: bold">修改密碼</label>
        <div class="input-box" style="padding-top: 10px">
          <div class="input-field">
            <input v-model="pwd.oPwd" v-trim-input class="box" placeholder="舊密碼"
              :type="pwd.showoPwd ? 'text' : 'password'" @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
        </div>
        <div class="input-box" style="padding-top: 10px">
          <div class="input-field">
            <input v-model="pwd.nPwd" v-trim-input class="box" placeholder="新密碼"
              :type="pwd.shownPwd ? 'text' : 'password'" @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
        </div>
        <div class="input-box" style="padding-top: 10px">
          <div class="input-field">
            <input v-model="pwd.nPwdConfirm" v-trim-input class="box" placeholder="確認新密碼"
              :type="pwd.shownPwdConfirm ? 'text' : 'password'" @copy.prevent @paste.prevent @contextmenu.prevent />
          </div>
        </div>
        <br />
        <div class="btn" @click="sendPasswordChange(1)">確認修改</div>
      </div>
    </div>
    <footerBottom />
  </div>
</template>
<style scoped lang="sass">
.cont
  padding-block-start: 147.5px
  @media (max-width: 768px)
    padding-block-start: 100px
.user-info
  width: 1170px
  max-width: 100%
  margin: 60px auto
  padding: 15px
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 25px
  .user-info-block
    border: 1px solid #ddd
    padding: 15px
    display: flex
    flex-direction: column
    align-items: flex-start
    .user-title
      font-size: 34px
      font-weight: bold
      display: flex
      align-items: center
    .user-tel
      font-weight: 500
      margin-inline-start: 10px
      font-size: 16px
    .user-account
      color: #999
      padding: 0 0 15px
      font-size: 14px
    .user-line
      color: #baa38f
      border: 1px solid #baa38f
      border-radius: 6px
      display: flex
      align-items: flex-start
      gap: 8px
      padding: 2px 5px 2px 2px
      margin: 5px 0
      img
        border-radius: 7px
        height: 100%
      span
        background: #fff
        padding: 1px 6px
        border-radius: 4px
        // background: #baa38f
        color:#baa38f
    .edit-nav
      padding-right: 40px
      position: relative
      cursor: pointer
      .edit-icon
        position: absolute
        width: 20px
        height: 20px
        fill: #baa38f99
        right: 10px
        top: 50%
        transform: translateY(-50%)
  .w-full
    border: 1px solid #ddd
    padding: 15px 60px 15px 15px
    .input-box
      .input-field
        border-block-end: 1px solid #ddd
        padding: 10px 0
        input
          width: 100%
    .btn
      background: #baa38f
      border: 1px solid #baa38f
      color: #fff
      padding: 6px 15px
      border-radius: 5px
      cursor: pointer
      display: inline-block
      transition: all .1s ease
      &:hover
        background: transparent
        color: #baa38f
@media (max-width: 768px)
  .user-info
    grid-template-columns: 1fr
    .user-info-block
      .user-title
        font-size: 28px
      .user-tel
        font-size: 14px
      .user-account
        font-size: 12px
      .user-line
        span
          padding: 1px 4px
  .w-full
    padding: 15px !important
</style>
