<script lang="ts" setup>
const siteStore = useSiteStore()
const { queryChatbox } = siteStore
const { signin } = useAuthStore()
const passwordEyes = ref(false)
const recaptchaCode = ref('')
const recaptchaCheckFunction = ref(null)
const { t } = useI18n()
const scrollTop = ref(0)
const fetchSigninApi = ref({
  account: '',
  password: ''
})

const showPassword = (type: boolean) => {
  passwordEyes.value = type
}

const setLogin = async () => {
  if (!fetchSigninApi.value.account) {
    ElMessage({
      message: t('請輸入帳號'),
      type: 'error'
    })
    return
  }
  if (!fetchSigninApi.value.password) {
    ElMessage({
      message: t('請輸入密碼'),
      type: 'error'
    })
    return
  }
  const recaptchaCheck = await recaptchaCheckFunction.value?.validate(
    recaptchaCode.value
  )
  if (!recaptchaCheck) {
    ElMessage({
      message: t('驗證碼錯誤'),
      type: 'error'
    })
  } else {
    const res = await signin(fetchSigninApi.value)

    if (res.success) {
      navigateTo('/')
    }
  }
}
const checkHepler = async (data) => {
  recaptchaCheckFunction.value = data
}

await useAsyncData(async () => {
  if (!router.currentRoute.value.name.inCludes('model')) {
    if (isLogin()) {
      navigateTo('/')
    }
  }
})

onMounted(async () => {
  if (window) {
    console.log('window', window.innerWidth)
    window.addEventListener('scroll', handleScroll)
  }
  const queryChatboxPromise = queryChatbox()
  queryChatboxPromise
    .then((queryChatboxRes) => {
      // 處理響應結果
      console.log('queryChatboxRes', queryChatboxRes.data)
    })
    .catch((error) => {
      console.error('Error loading queryChatboxRes data:', error)
    })
})

definePageMeta({
  layout: 'auth'
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
</script>

<template>
  <div class="layouts-auth">
    <headerTop :opaque="scrollTop >= 0"></headerTop>
    <div class="layouts-auth__view">
      <div class="bg-layer">
        <div class="main-icon">
          <img :src="siteStore?.siteData.logo" />
        </div>
        <h1>{{ $lang('登入') }}</h1>
        <div class="header-main">
          <div class="header-left-bottom">
            <div class="icon1">
              <input v-model="fetchSigninApi.account" v-trim-input type="text" label="電郵或手機號碼"
                :placeholder="t('請輸入電郵或手機號碼')" errormessage="電郵或手機號碼是必須的" class="chakra-input">
            </div>
            <div class="icon1 chakra">
              <input v-model="fetchSigninApi.password" v-trim-input :type="passwordEyes ? 'text' : 'password'"
                label="密碼" :placeholder="t('密碼')" class="chakra-input">
              <svg viewBox="0 0 20 14" focusable="false" class="chakra-icon" @click="showPassword(false)"
                v-if="passwordEyes">
                <path
                  d="M10 3.75C8.20507 3.75 6.75 5.20507 6.75 7C6.75 8.79493 8.20507 10.25 10 10.25C11.7949 10.25 13.25 8.79493 13.25 7C13.25 5.20507 11.7949 3.75 10 3.75ZM8.25 7C8.25 6.0335 9.0335 5.25 10 5.25C10.9665 5.25 11.75 6.0335 11.75 7C11.75 7.9665 10.9665 8.75 10 8.75C9.0335 8.75 8.25 7.9665 8.25 7Z"
                  fill="currentColor"></path>
                <path
                  d="M10 0.25C5.61579 0.25 1.85847 2.92206 0.305875 6.71594C0.231375 6.89799 0.231375 7.10202 0.305875 7.28406C1.85847 11.0779 5.6158 13.75 10 13.75C14.3842 13.75 18.1415 11.0779 19.6941 7.28406C19.7686 7.10202 19.7686 6.89799 19.6941 6.71594C18.1415 2.92206 14.3842 0.25 10 0.25ZM10 12.25C6.3488 12.25 3.21109 10.0915 1.81629 7C3.21109 3.90852 6.34879 1.75 10 1.75C13.6512 1.75 16.7889 3.90852 18.1837 7C16.7889 10.0915 13.6512 12.25 10 12.25Z"
                  fill="currentColor"></path>
              </svg>
              <svg viewBox="0 0 20 14" focusable="false" class="chakra-icon" @click="showPassword(true)"
                v-if="!passwordEyes">
                <path
                  d="M19.5088 1.2089C19.611 1.25074 19.6601 1.36775 19.6163 1.46914C19.1289 2.59656 18.4454 3.62068 17.6082 4.49961L18.9568 5.99878L17.8417 7.00198L16.4985 5.50888C15.5938 6.22036 14.5674 6.7865 13.4555 7.17185L14.1946 9.2714L12.8053 9.72941L12.0394 7.55372C11.3797 7.68288 10.6977 7.75059 9.99978 7.75059C9.32819 7.75059 8.67131 7.68789 8.0348 7.56806L7.31157 9.73778L5.88854 9.26343L6.58145 7.18472C5.46686 6.80317 4.43758 6.24022 3.52977 5.53138L2.03027 7.03088L0.969613 5.97021L2.41524 4.52459C1.56718 3.64011 0.875232 2.60726 0.383259 1.46914C0.339431 1.36775 0.388517 1.25074 0.490744 1.2089L1.50879 0.79228C1.61102 0.750444 1.72764 0.799611 1.7718 0.900853C3.14365 4.04555 6.30943 6.25059 9.99978 6.25059C13.6901 6.25059 16.8559 4.04555 18.2277 0.900854C18.2719 0.799611 18.3885 0.750444 18.4907 0.79228L19.5088 1.2089Z"
                  fill="currentColor"></path>
              </svg>
            </div>
            <div class="icon1">
              <recaptcha @check-hepler="checkHepler"></recaptcha>
              <input v-model="recaptchaCode" v-trim-input type="text" :placeholder="t('請輸入驗證碼')" class="inputStyle"
                @keyup.enter="setLogin" />
            </div>
            <div class="links">
              <p class="right">
                <a @click="openChatBox()">{{ $lang('忘記密碼?') }}</a>
              </p>
              <div class="clear"></div>
            </div>
            <div>
              <div class="btn sub-btn" @click="setLogin">{{ $lang('開始購物吧！') }}</div>
            </div>
          </div>
          <h1>{{ $lang('還不是會員？') }}</h1>
          <div>
            <div class="btn reg-btn" style="background-color: rgb(233, 126, 54)" @click="navigateTo('/register')">
              {{ $lang('註冊會員') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <footerBottom />
  </div>
</template>

<style scoped lang="sass">
.layouts-auth__view
  padding-top: 146.5px
  @media (max-width:768px)
    padding-top: 110px
  .bg-layer
    max-width: 460px
    margin: 10px auto 50px
    padding: 20px
    @media (max-width:768px)
      margin-top: 0
    h1
      font-family: "Noto Serif TC"
      font-size: 32px
      color: #5d5d5d
      font-weight: 700
      margin-bottom: 20px
    .main-icon
      height: 5rem
      display: flex
      justify-content: center
      img
        height: 100%
    .header-left-bottom
      font-family: "Noto Serif TC"
      margin-bottom: 50px
      .icon1
        margin-block-start: 15px
        height: 45px
        width: 100%
        border-block-end: 1px solid #e5e5e5
        display: flex
        align-items: center
        .chakra-input,.inputStyle
          width: 100%
          height: 100%
          border: none
          outline: none
          padding: 0 10px
      .chakra
        position: relative
        .chakra-input
          padding-right: 40px
        .chakra-icon
          position: absolute
          z-index: 1
          right: 8px
          top: 50%
          transform: translateY(-50%)
          width: 20px
          height: 20px
          cursor: pointer
    .links
      display: flex
      justify-content: space-between
      padding: 10px 5px 20px
      font-size: 14px
      a
        &:hover
          color: #111
    .btn
      width: 100%
      padding: 10px 0
      display: flex
      justify-content: center
      align-items: center
      background:  #baa38f
      color: #fff
      border-radius: 5px
      border: 1px solid  #baa38f
      cursor: pointer
      transition: all .3s ease-in-out
      &:hover
        background:  #fff
        color:  #baa38f
    .reg-btn
      background:  #fff !important
      color:  #baa38f !important
      &:hover
        background:  #baa38f11 !important

</style>
