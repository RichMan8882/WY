<script lang="ts" setup>
const { t } = useI18n()
const router = useRouter()
const referrerCodeCookiee = useCookie('referrerCode') as any
const siteStore = useSiteStore()
const signupData = ref({
  account: '',
  password: '',
  transactionPassword: '',
  username: '',
  referrerCode: '',
  countryCode: siteStore.siteData.localsOptions[0],
  mobile: '',
  socialPlatform: 'line',
  socialId: '',
  additionalInfo: {}
})
const additionalInfo1Value = ref('Line')
const showReferrerInput = ref(false)
const verifyPassword = ref('')
const verifyTransactionPassword = ref('')
const isChecked = ref(false)
const recaptchaCode = ref('')
const recaptchaCheckFunction = ref(null)
const passwordEyes = ref(false)
const tPasswordEyes = ref(false)
const { signup } = useAuthStore()
const validationStatus = reactive({
  accountValid: false,
  passwordValid: false,
  passwordSame: true,
  transactionPasswordValid: false,
  transactionPasswordSameWithPassword: false,
  transactionPasswordSame: true,
  phoneValid: false
})
const passwordSameRef = ref(null)
const transactionPasswordRef = ref(null)
const transactionPasswordSameRef = ref(null)
const usernameRef = ref(null)
const mobileRef = ref(null)
const socialIdRef = ref(null)
const isFormValid = computed(() => {
  console.log('passwordSameRef.value', passwordSameRef.value)
  console.log(
    'transactionPasswordSameRef.value',
    transactionPasswordSameRef.value
  )

  // 如果有額外欄位資訊，則需要添加額外驗證
  let isValid = validationStatus.accountValid && validationStatus.passwordValid

  if (passwordSameRef.value !== null) {
    isValid = isValid && validationStatus.passwordSame
  }

  if (transactionPasswordRef.value !== null) {
    isValid =
      isValid &&
      validationStatus.transactionPasswordValid &&
      !validationStatus.transactionPasswordSameWithPassword
  }
  if (transactionPasswordSameRef.value !== null) {
    isValid =
      isValid &&
      validationStatus.transactionPasswordSame &&
      !validationStatus.transactionPasswordSameWithPassword
  }
  if (usernameRef.value !== null) {
    isValid = isValid && signupData.value.username
  }
  if (mobileRef.value !== null) {
    isValid = isValid && signupData.value.mobile
  }
  if (signupData.value.mobile) {
    isValid = isValid && validationStatus.phoneValid
  }
  if (socialIdRef.value !== null) {
    isValid = isValid && signupData.value.socialId
  }

  console.log('isFormValid:', isValid) // 添加日志
  return isValid
})

const validateAccount = () => {
  const regex = /^[a-zA-Z0-9]{4,20}$/
  validationStatus.accountValid = regex.test(signupData.value.account)
  checkTransactionPasswordSameWithPassword()
}

const checkPasswordRequired = () => {
  const passwordRegex = /^.{3,}$/
  // const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{3,}$/
  validationStatus.passwordValid = passwordRegex.test(signupData.value.password)
  //  && signupData.value.password !== signupData.value.account
  if (verifyPassword.value) {
    checkPasswordSame()
  }
  if (signupData.value.transactionPassword) {
    checkTransactionPasswordSameWithPassword()
  }
}

const checkPasswordSame = () => {
  validationStatus.passwordSame =
    signupData.value.password === verifyPassword.value
}

const checkTransactionPasswordRequired = () => {
  const passwordRegex = /^.{3,}$/
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{3,}$/
  validationStatus.transactionPasswordValid = passwordRegex.test(
    signupData.value.transactionPassword
  )
  checkTransactionPasswordSameWithPassword()
  if (verifyTransactionPassword.value) {
    checkTransactionPasswordSame()
  }
}

const checkTransactionPasswordSameWithPassword = () => {
  validationStatus.transactionPasswordSameWithPassword =
    signupData.value.transactionPassword === signupData.value.password ||
    signupData.value.transactionPassword === signupData.value.account
}

const checkTransactionPasswordSame = () => {
  validationStatus.transactionPasswordSame =
    signupData.value.transactionPassword === verifyTransactionPassword.value
}

const showPhoneValid = computed(() => {
  if (signupData.value.countryCode == '+886') {
    return true
  } else {
    return false
  }
})

const checkPhoneValid = () => {
  const regex = /^09\d{8}$/
  if (signupData.value.countryCode == '+886') {
    validationStatus.phoneValid = regex.test(signupData.value.mobile)
  } else {
    validationStatus.phoneValid = !!signupData.value.mobile
  }
}

const checkHepler = async (data) => {
  recaptchaCheckFunction.value = data
}
// methods
const showPassword = (type: boolean) => {
  passwordEyes.value = type
}
const showTranscationPassword = (type: boolean) => {
  tPasswordEyes.value = type
}

const handleRegisterClick = () => {
  console.log('Button clicked, isFormValid:', isFormValid.value)
  if (isFormValid.value) {
    goRegister()
  }
}

const goRegister = async () => {
  console.log('goRegister')
  if (!isChecked.value) {
    ElMessage({
      message: `${t('請勾選同意條款')}`,
      type: 'error',
      duration: 1000,
      showClose: false
    })
    return
  }
  const recaptchaCheck = await recaptchaCheckFunction.value.validate(
    recaptchaCode.value
  )
  if (!recaptchaCheck) {
    if (recaptchaCode.value.length === 0) {
      ElMessage({
        message: `${t('請填寫驗證碼')}`,
        type: 'error',
        duration: 1000,
        showClose: false
      })
    } else {
      ElMessage({
        message: `${t('驗證碼錯誤')}`,
        type: 'error',
        duration: 1000,
        showClose: false
      })
    }

  } else {
    const signupRes = await signup(signupData.value)
    console.log('signupRes', signupRes)
    if (signupRes.success) {
      referrerCodeCookiee.value = ''
      navigateTo('/')
    }
  }
}

const { isLogin } = useAuthStore()
await useAsyncData(async () => {
  if (!router.currentRoute.value.name.includes('model')) {
    if (isLogin()) {
      navigateTo('/')
    }
  }
  if (router.currentRoute.value.query.referrer) {
    signupData.value.referrerCode = router.currentRoute.value.query.referrer
  } else if (referrerCodeCookiee.value) {
    signupData.value.referrerCode = referrerCodeCookiee.value
  }
})

await onMounted(() => {
  if (window) {
    console.log('window', window.innerWidth)
    window.addEventListener('scroll', handleScroll)
  }
  showReferrerInput.value = !!(
    router.currentRoute.value.query.referrer || referrerCodeCookiee.value
  )
})

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
  <div class="layouts-auth">
    <headerTop :opaque="scrollTop >= 0"></headerTop>
    <div class="layouts-auth__view">
      <div class="bg-layer">
        <div class="main-icon">
          <img :src="siteStore?.siteData.logo" />
        </div>
        <h1>{{ $lang('注冊') }}</h1>
        <div class="header-main">
          <div class="header-left-bottom">
            <div class="icon1">
              <input v-model="signupData.account" v-trim-input type="text" :placeholder="t('請輸入帳號')"
                class="chakra-input" @input="validateAccount" />
            </div>
            <div class="tips">
              <div :class="validationStatus.accountValid
                ? 'valid-feedback'
                : 'invalid-feedback'
                ">
                <span v-if="validationStatus.accountValid">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('需使用4-20位英文或數字') }}
              </div>
            </div>
            <div class="icon1">
              <input v-model="signupData.password" v-trim-input :type="passwordEyes ? 'text' : 'password'"
                :placeholder="t('請輸入密碼')" class="chakra-input" @input="checkPasswordRequired" @copy="handCopyPaste"
                @paste="handCopyPaste" @contextmenu="handCopyPaste" />
            </div>
            <div class="tips">
              <div :class="validationStatus.passwordValid
                ? 'valid-feedback'
                : 'invalid-feedback'
                ">
                <span v-if="validationStatus.passwordValid">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('需使用 3 個字元以上的英文或數字') }}
              </div>
              <div v-if="signupData.password" :class="signupData.password !== signupData.account
                ? 'valid-feedback'
                : 'invalid-feedback'
                ">
                <span v-if="signupData.password !== signupData.account">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('登入密碼不可與帳號相同') }}
              </div>
            </div>
            <div class="icon1">
              <input ref="passwordSameRef" v-model="verifyPassword" v-trim-input :placeholder="t('請再次確認密碼')"
                :type="passwordEyes ? 'text' : 'password'" class="chakra-input" @input="checkPasswordSame"
                @copy="handCopyPaste" @paste="handCopyPaste" @contextmenu="handCopyPaste" />
            </div>
            <div class="tips">
              <div>
                <div v-if="validationStatus.passwordSame" class="valid-feedback">
                  <i class="fas fa-check"></i> {{ $lang('確認相同') }}
                </div>
                <div v-else class="invalid-feedback">
                  <i class="fas fa-times"></i>
                  {{ $lang('與登入密碼不相同') }}
                </div>
                <div :class="verifyPassword ? 'valid-feedback' : 'invalid-feedback'
                  ">
                  <span v-if="verifyPassword">
                    <i class="fas fa-check"></i>
                  </span>
                  {{ $lang('必填') }}
                </div>
              </div>
            </div>

            <div class="icon1">
              <select v-model="signupData.countryCode" style="background-color: transparent" name="countryCode"
                @change="checkPhoneValid" class="tel-select">
                <option v-for="item in siteStore.siteData?.localsOptions" :key="item">
                  {{ item }}
                </option>
              </select>
              <input v-model="signupData.mobile" v-trim-input type="text" :placeholder="t('請輸入電話號碼')"
                class="chakra-input" @input="checkPhoneValid" />
            </div>
            <div class="tips">
              <div v-if="showPhoneValid">
                <div :class="validationStatus.phoneValid
                  ? 'valid-feedback'
                  : 'invalid-feedback'
                  ">
                  <span v-if="validationStatus.phoneValid">
                    <i class="fas fa-check"></i>
                  </span>
                  {{ $lang('手機號碼開頭須為09，共10碼') }}
                </div>
              </div>
              <div ref="mobileRef" :class="signupData.mobile ? 'valid-feedback' : 'invalid-feedback'
                ">
                <span v-if="signupData.mobile">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('必填') }}
              </div>
            </div>
            <div class="icon1">
              <input id="username" v-model="signupData.username" v-trim-input type="text" :placeholder="t('請輸入昵稱')"
                class="chakra-input" />
            </div>
            <div class="tips">
              <div ref="usernameRef" :class="signupData.username ? 'valid-feedback' : 'invalid-feedback'
                ">
                <span v-if="signupData.username">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('必填') }}
              </div>
            </div>
            <div class="icon1">
              <select v-model="signupData.socialPlatform" name="contactType" style="background-color: transparent">
                <option v-for="item in siteStore?.siteData?.socialOptions || []" :key="item">
                  {{ item }}
                </option>
              </select>
              <input v-model="signupData.socialId" v-trim-input :placeholder="t('其他聯繫方式')" type="text"
                class="chakra-input" />
            </div>
            <div class="tips">
              <div ref="socialIdRef" :class="signupData.socialId ? 'valid-feedback' : 'invalid-feedback'
                ">
                <span v-if="signupData.socialId">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('必填') }}
              </div>
            </div>
            <div class="icon1">
              <recaptcha @check-hepler="checkHepler"></recaptcha>
              <input id="captcha_input" v-model="recaptchaCode" v-trim-input type="text" name="captcha_input"
                :placeholder="t('請輸入驗證碼')" class="chakra-input" @keyup.enter="handleRegisterClick" />
            </div>

            <input id="captcha_result" type="hidden" name="captcha_result" value="12" />
            <div class="agreeCheck">
              <input v-model="isChecked" type="checkbox" />
              {{ $lang('我已年滿') }}
              18
              {{ $lang('歲，並已閱讀、接受並同意') }}
              <a class="link"> {{ $lang('服務條款') }}<i class="fas fa-external-link-alt ml-2"></i></a>
              {{ $lang('及') }}
              <a class="link">{{ $lang('隱私權政策') }}<i class="fas fa-external-link-alt ml-2"></i></a>
            </div>

            <div style="margin-top: 16px">
              <div class="btn sub-btn" @click="handleRegisterClick">
                {{ $lang('送出') }}
              </div>
            </div>
            <div style="margin-top: 70px">
              <h1>已經有帳號？</h1>
              <p class="chakra-text">立即登入享有更多優惠！</p>
              <div class="btn reg-btn" style="background-color: rgb(233, 126, 54)" @click="navigateTo('/login')">
                {{ $lang('登入') }}
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
    .chakra-text
      font-size: 14px
      padding:0 0 20px
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
        select
          border: none !important
          outline: none !important
          background: transparent
          option:checked 
            background: #baa38f
            background-color: rgba(186, 163, 143, 0.5)
            color: #fff
          option:hover
            background: #baa38f
            background-color: rgba(186, 163, 143, 0.5)
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
      .tips
        .valid-feedback
          display: none
        .invalid-feedback
          color: #ff4c4c
          font-size: 12px
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
.agreeCheck
  padding: 10px 0 20px
  font-size: 14px
  .link
    border-block-end: 1px solid  #5d5d5d
    color:  #5d5d5d
    text-decoration: none
    &:hover
      color:  #baa38f
      border-block-end: 1px solid  #baa38f

</style>
