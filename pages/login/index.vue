<script lang="ts" setup>
const siteStore = useSiteStore()
const { queryChatbox } = siteStore
const { signin } = useAuthStore()
const passwordEyes = ref(false)
const recaptchaCode = ref('')
const recaptchaCheckFunction = ref(null)
const { t } = useI18n()

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
</script>

<template>
  <div class="layouts-auth">
    <div class="layouts-auth__video"></div>
    <div class="layouts-auth__view">
      <div class="bg-layer">
        <h1>{{ $lang('職員登入') }}</h1>
        <div class="header-main">
          <div class="main-icon">
            <img :src="siteStore?.siteData.logo" />
          </div>
          <div class="header-left-bottom">
            <div class="icon1">
              <span style="font-weight: bold">{{ $lang('職員帳號') }}</span>
              <input
                v-model="fetchSigninApi.account"
                v-trim-input
                type="text"
                name="acc"
                :placeholder="t('請輸入職員帳號')"
                class="inputStyle"
              />
            </div>
            <div class="icon1">
              <span style="font-weight: bold">{{ $lang('輸入密碼') }}</span>
              <input
                v-model="fetchSigninApi.password"
                v-trim-input
                type="password"
                name="pass"
                :placeholder="t('請輸入密碼')"
                class="inputStyle"
              />
            </div>

            <div class="icon1">
              <recaptcha @check-hepler="checkHepler"></recaptcha>
            </div>
            <div class="icon1">
              <span style="font-weight: bold">{{ $lang('驗證碼') }}</span>
              <input
                v-model="recaptchaCode"
                v-trim-input
                type="text"
                :placeholder="t('請輸入驗證碼')"
                class="inputStyle"
                @keyup.enter="setLogin"
              />
            </div>

            <input
              id="captcha_result"
              type="hidden"
              name="captcha_result"
              value="12"
            />

            <div>
              <div class="btn" @click="setLogin">{{ $lang('登入') }}</div>
              <div
                class="btn"
                style="background-color: rgb(233, 126, 54)"
                @click="navigateTo('/register')"
              >
                {{ $lang('註冊') }}
              </div>
            </div>
            <div class="links">
              <p>
                <a @click="navigateTo('/')">{{ $lang('返回首頁') }}</a>
              </p>
              <p class="right">
                <a @click="openChatBox()">{{ $lang('忘記密碼?') }}</a>
              </p>
              <div class="clear"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes backgroundSwitch
  from
    transform: translateX(0)
  to
    transform: translateX(-100%)
.layouts-auth
  position: relative
  width: 100%
  min-height: 100dvh
  &__video
    // position: absolute
    // top: 0
    height: 100vh
    // right: 0
    // bottom: 0
    // left: 0

    width: auto

    overflow: hidden
    // display: flex
    //background-position: center
    //background-size: cover
    //filter: grayscale(1)
    //> video
    //  width: 100%
    //  height: 100%
    //  object-fit: cover
    //  object-position: center
  &__view
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    overflow-x: hidden
    overflow-y: auto
  .up,.up2
    height: 50vh
    display: flex
    flex-wrap: nowrap
    .bgimg
      display: flex
      flex-wrap: nowrap
      animation: backgroundSwitch 35s linear infinite
      img
        width: auto
        max-width: 99999px
        height: 50vh
        flex-shrink: 0
        // object-fit: cover
</style>

<style scoped lang="sass"></style>
<style scoped lang="sass">
.bg-layer
  background: rgba(0, 0, 0, 50%)
  min-height: 100vh

h1
  font-size: 45px
  color: #fff
  font-weight: 800
  text-transform: uppercase
  letter-spacing: 4px
  text-align: center
  padding: 1em 0 0.4em 0

.header-main
  width: 374px
  margin: 0 auto
  position: relative
  z-index: 999
  padding: 3em 2em
  background: rgba(255, 255, 255, 75%)
  -webkit-box-shadow: -1px 4px 28px 0px rgba(0, 0, 0, 0.75)
  -moz-box-shadow: -1px 4px 28px 0px rgba(0, 0, 0, 0.75)
  box-shadow: -1px 4px 28px 0px rgba(0, 0, 0, 0.75)

.main-icon
  text-align: center
  margin: 0 auto 20px

  img
    width: 80px
img
  max-width: 100%

.icon1
  margin: 0 0 1em
  padding: .8em 1em
  background: rgba(255, 255, 255, 30%)
  color: black
  display: flex
  align-items: center
  span
    min-width: 64px !important
    // white-space: nowrap

.bottom
  margin: 1em 0 0

.header-left-bottom .btn
  background: #007cc0
  color: #fff
  font-size: 18px
  font-weight: bold
  text-transform: uppercase
  padding: .8em 2em
  letter-spacing: 1px
  transition: 0.5s all
  -webkit-transition: 0.5s all
  -moz-transition: 0.5s all
  -o-transition: 0.5s all
  display: inline-block
  cursor: pointer
  outline: none
  border: none
  width: 100%

a
  color: #585858
  margin: 0em

.header-left-bottom p
  font-size: 17px
  color: #000
  display: inline-block
  width: 50%
  margin: 20px 0 0
  letter-spacing: 1px
  float: left

  a
    font-size: 16px
    font-weight: bold
    color: #000000
    text-transform: uppercase
.links
  height: 57px
  cursor: pointer
  .right
    text-align: right
.inputStyle
  width:100%
  padding: 8px
  margin-left: 10px
  border: 1px solid black
  opacity: 0.4
</style>
