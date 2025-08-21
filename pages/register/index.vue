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
  socialPlatform: '',
  socialId: '',
  additionalInfo: {}
})
const additionalInfo1Value = ref('Line')
const showReferrerInput = ref(false)
const verifyPassword = ref('')
const verifyTransactionPassword = ref('')
const isChecked = ref(true)
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
    ElNotification({
      title: `${t('請勾選同意條款')}`,
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
    ElMessage({
      message: `${t('驗證碼錯誤')}`,
      type: 'error',
      showClose: false
    })
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
  showReferrerInput.value = !!(
    router.currentRoute.value.query.referrer || referrerCodeCookiee.value
  )
})
</script>

<template>
  <div class="layouts-auth">
    <div class="layouts-auth__video"></div>
    <div class="layouts-auth__view">
      <div class="bg-layer">
        <h1>{{ $lang('職員注冊') }}</h1>
        <div class="header-main">
          <div class="main-icon">
            <img :src="siteStore?.siteData.logo" />
          </div>
          <div class="header-left-bottom">
            <div v-if="showReferrerInput" class="icon1">
              <span style="font-weight: bold">{{ $lang('推薦碼') }}</span>
              <input
                v-model="signupData.referrerCode"
                v-trim-input
                type="text"
                name="pAcc"
                :placeholder="t('請輸入推薦碼')"
                class="input_style"
                :readonly="router.currentRoute.value.query.referrer"
              />
            </div>
            <div class="icon1">
              <span style="font-weight: bold">{{ $lang('職員帳號') }}</span>
              <input
                v-model="signupData.account"
                v-trim-input
                type="text"
                :placeholder="t('請輸入職員帳號')"
                class="input_style"
                @input="validateAccount"
                @copy="handCopyPaste"
                @paste="handCopyPaste"
                @contextmenu="handCopyPaste"
              />
            </div>
            <div class="tips">
              <div
                :class="
                  validationStatus.accountValid
                    ? 'valid-feedback'
                    : 'invalid-feedback'
                "
              >
                <span v-if="validationStatus.accountValid">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('需使用4-20位英文或數字') }}
              </div>
            </div>
            <div class="icon1">
              <span style="font-weight: bold">{{ $lang('職員密碼') }}</span>
              <input
                v-model="signupData.password"
                v-trim-input
                :type="passwordEyes ? 'text' : 'password'"
                :placeholder="t('請輸入職員密碼')"
                class="input_style"
                @input="checkPasswordRequired"
                @copy="handCopyPaste"
                @paste="handCopyPaste"
                @contextmenu="handCopyPaste"
              />
            </div>
            <div class="tips">
              <div
                :class="
                  validationStatus.passwordValid
                    ? 'valid-feedback'
                    : 'invalid-feedback'
                "
              >
                <span v-if="validationStatus.passwordValid">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('需使用 3 個字元以上的英文或數字') }}
                <!-- {{ $lang('需混合使用 3 個字元以上的英文或數字。') }} -->
              </div>
              <div
                v-if="signupData.password"
                :class="
                  signupData.password !== signupData.account
                    ? 'valid-feedback'
                    : 'invalid-feedback'
                "
              >
                <span v-if="signupData.password !== signupData.account">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('登入密碼不可與帳號相同') }}
              </div>
            </div>
            <div class="icon1">
              <span style="font-weight: bold">{{ $lang('確認密碼') }}</span>
              <input
                ref="passwordSameRef"
                v-model="verifyPassword"
                v-trim-input
                :placeholder="t('請確認職員密碼')"
                :type="passwordEyes ? 'text' : 'password'"
                class="input_style"
                @input="checkPasswordSame"
                @copy="handCopyPaste"
                @paste="handCopyPaste"
                @contextmenu="handCopyPaste"
              />
            </div>
            <div class="tips">
              <div v-if="verifyPassword">
                <div
                  v-if="validationStatus.passwordSame"
                  class="valid-feedback"
                >
                  <i class="fas fa-check"></i> {{ $lang('確認相同') }}
                </div>
                <div v-else class="invalid-feedback">
                  <i class="fas fa-times"></i>
                  {{ $lang('與登入密碼不相同') }}
                </div>
              </div>
            </div>
            <div
              v-if="siteStore.siteData.transactionPasswordRequired"
              class="icon1"
            >
              <span style="font-weight: bold">{{ $lang('薪資提款密碼') }}</span>
              <input
                ref="transactionPasswordRef"
                v-model="signupData.transactionPassword"
                v-trim-input
                :type="tPasswordEyes ? 'text' : 'password'"
                class="input_style"
                @input="checkTransactionPasswordRequired"
                @copy="handCopyPaste"
                @paste="handCopyPaste"
                @contextmenu="handCopyPaste"
              />
            </div>
            <div
              v-if="siteStore.siteData.transactionPasswordRequired"
              class="tips"
            >
              <div
                :class="
                  validationStatus.transactionPasswordValid
                    ? 'valid-feedback'
                    : 'invalid-feedback'
                "
              >
                <span v-if="validationStatus.transactionPasswordValid">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('需使用 3 個字元以上的英文或數字') }}
                <!-- {{ $lang('需混合使用 3 個字元以上的英文或數字。') }} -->
              </div>
              <!-- <div
                  v-if="signupData.transactionPassword"
                  :class="
                    !validationStatus.transactionPasswordSameWithPassword
                      ? 'valid-feedback'
                      : 'invalid-feedback'
                  "
                >
                  <span
                    v-if="!validationStatus.transactionPasswordSameWithPassword"
                  >
                    <i class="fas fa-check"></i>
                  </span>
                  {{ $lang('交易密碼不可與登入密碼,帳號相同') }}
                </div> -->
            </div>
            <div
              v-if="siteStore.siteData.transactionPasswordRequired"
              class="icon1"
            >
              <span style="font-weight: bold">{{ $lang('提款密碼確認') }}</span>
              <input
                ref="transactionPasswordSameRef"
                v-model="verifyTransactionPassword"
                v-trim-input
                :type="tPasswordEyes ? 'text' : 'password'"
                class="input_style"
                @input="checkTransactionPasswordSame"
                @copy="handCopyPaste"
                @paste="handCopyPaste"
                @contextmenu="handCopyPaste"
              />
            </div>
            <div class="tips">
              <div v-if="verifyTransactionPassword">
                <div
                  v-if="validationStatus.transactionPasswordSame"
                  class="valid-feedback"
                >
                  <i class="fas fa-check"></i> {{ $lang('確認相同') }}
                </div>
                <div v-else class="invalid-feedback">
                  <i class="fas fa-times"></i>
                  {{ $lang('與交易密碼不相同') }}
                </div>
              </div>
            </div>
            <div class="icon1" style="display: block">
              <span style="font-weight: bold">{{ $lang('電話號碼') }}</span>

              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <select
                  v-model="signupData.countryCode"
                  style="background-color: transparent"
                  name="countryCode"
                  @change="checkPhoneValid"
                >
                  <option
                    v-for="item in siteStore.siteData?.localsOptions"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </select>
                <input
                  v-model="signupData.mobile"
                  v-trim-input
                  type="text"
                  :placeholder="t('請輸入電話號碼')"
                  class="input_style"
                  @input="checkPhoneValid"
                />
              </div>
            </div>
            <div class="tips">
              <div
                v-if="showPhoneValid"
                :class="
                  validationStatus.phoneValid
                    ? 'valid-feedback'
                    : 'invalid-feedback'
                "
              >
                <span v-if="validationStatus.phoneValid">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('手機號碼開頭須為09，共10碼') }}
              </div>
              <div
                ref="mobileRef"
                :class="
                  signupData.mobile ? 'valid-feedback' : 'invalid-feedback'
                "
              >
                <span v-if="signupData.mobile">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('必填') }}
              </div>
            </div>
            <div class="icon1">
              <span style="font-weight: bold">{{ $lang('職員姓名') }}</span>
              <input
                id="username"
                v-model="signupData.username"
                v-trim-input
                type="text"
                :placeholder="t('請輸入職員姓名')"
                class="input_style"
              />
            </div>
            <div class="tips">
              <div
                ref="usernameRef"
                :class="
                  signupData.username ? 'valid-feedback' : 'invalid-feedback'
                "
              >
                <span v-if="signupData.username">
                  <i class="fas fa-check"></i>
                </span>
                {{ $lang('必填') }}
              </div>
            </div>
            <!-- <div class="icon1" style="display: block">
                <span style="font-weight: bold">LINE聯繫方式</span>

                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <select
                    v-model="signupData.socialPlatform"
                    name="contactType"
                    style="background-color: transparent"
                  >
                    <option
                      v-for="item in siteStore?.siteData?.socialOptions || []"
                      :key="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                  <input
                    v-model="signupData.socialId"
                    v-trim-input
                    :placeholder="t('請輸入LINE聯繫方式')"
                    type="text"
                    class="input_style"
                  />
                </div>
              </div>
              <div class="tips">
                <div
                  ref="socialIdRef"
                  :class="
                    signupData.socialId ? 'valid-feedback' : 'invalid-feedback'
                  "
                >
                  <span v-if="signupData.socialId">
                    <i class="fas fa-check"></i>
                  </span>
                  {{ $lang('必填') }}
                </div>
              </div> -->

            <div class="icon1">
              <recaptcha @check-hepler="checkHepler"></recaptcha>
            </div>
            <div class="icon1">
              <span style="font-weight: bold"
                >{{ $lang('驗證碼') }}&nbsp;&nbsp;&nbsp;&nbsp;</span
              >
              <input
                id="captcha_input"
                v-model="recaptchaCode"
                v-trim-input
                type="text"
                name="captcha_input"
                :placeholder="t('請輸入驗證碼')"
                class="input_style"
                @keyup.enter="handleRegisterClick"
              />
            </div>

            <input
              id="captcha_result"
              type="hidden"
              name="captcha_result"
              value="12"
            />
            <div class="agreeCheck">
              <input v-model="isChecked" type="checkbox" />
              {{ $lang('我已年滿') }}18{{
                $lang('歲，並已閱讀、接受並同意條款和條件、規則、隱私政策、')
              }}Cookie{{ $lang('政策以及與年齡驗證相關的政策') }}
              <div class="icon">
                <i class="fas fa-external-link-alt ml-2"></i>
              </div>
            </div>
            <div style="margin-top: 16px">
              <div class="btn" @click="handleRegisterClick">
                {{ $lang('送出') }}
              </div>
              <div
                class="btn"
                style="background-color: rgb(233, 126, 54)"
                @click="navigateTo('/login')"
              >
                {{ $lang('登入') }}
              </div>
            </div>
            <div class="links">
              <p>
                <a @click="navigateTo('/')">{{ $lang('返回首頁') }}</a>
              </p>
              <!--<p class="right"><a href="#">聯絡客服</a></p>-->
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
<style scoped lang="sass">


@mixin input-double()
  width: 100%
  padding: 15px 5px
  color: $primary-color
  background-color: rgba(0, 0, 0, 0)
  border-bottom: 1px solid $primary-color
  outline: none

.pages-register
  padding-top: 75px
  padding-bottom: 50px
  &__form
    @include form-section(860px)
    margin: 0 auto
    &-title
      @include page-font()
      color: $primary-color
      text-align: center
      font-size: 28px
      margin-bottom: 34px
    &-fields
      margin-bottom: 20px
    &-input
      &:not(:last-child)
        margin-bottom: 28px
      &--text
        @include form-input(26px, 26px)
      &--double
        position: relative
        display: flex
        flex-direction: row
        padding: 15px 0 15px 45px
        > img
          position: absolute
          top: 50%
          left: 10px
          width: 26px
          height: 26px
          transform: translateY(-50%)
          object-fit: cover
          object-position: center
        > div
          display: flex
          flex-direction: column
          width: 100%
          > select
            @include input-double()
          > input
            @include input-double()
            &::placeholder
              color: rgba(117, 117, 117, 1)
      &--code
        padding: 15px 0
        font-size: 16px
        > :last-child
          display: flex
          flex-direction: row
          align-items: center
          > span
            color: #fff
            font-weight: 900
            white-space: nowrap
            margin-right: 36px
          > input
            @include input-double()
            &::placeholder
              color: rgba(117, 117, 117, 1)
    &-info
      margin-bottom: 30px
      label
        display: block
        width: 600px
        margin: 0 auto
        color: #fff
        font-family: -apple-system, "system-ui", PingFang, "Microsoft Jheng Hei", 微軟正黑體, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
        font-size: 16px
        font-weight: 700
        line-height: 24px
      a
        color: #007bff
        margin-left: 8px
        font-size: 16px
        font-weight: 900
    &-submit
      display: flex
      justify-content: center
      width: 100%
      margin-bottom: 20px
      > button
        @include page-button-font()
        width: 100%
        max-width: 227px
        line-height: 21px
        padding: 15px 16px
        color: #000
        background-color: $primary-color
        border: 1px solid $primary-color
        border-radius: 4px
        outline: none
    &-actions
      display: flex
      flex-direction: column
      align-items: center
      margin-bottom: 20px
      &-wrap
        display: flex
        flex-direction: row
        > *:not(:last-child)
          margin-right: 20px
    &-divide
      width: 100%
      height: 1px
      background-color: $primary-color
      margin: 30px 0 40px
    &-button
      font-family: -apple-system, "system-ui", "Microsoft Jheng Hei", PingFang, 蘋方, 微軟正黑體, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
      font-size: 15px
      line-height: 22.5px
      color: $primary-color
      outline: none
</style>

<style scoped lang="sass">
.tips
  width: 100%
  font-size: 12px
  color: red
  text-align: right
</style>

<style scoped lang="sass">
.btn-submit
  &.disabled
    background-color: #ccc
    cursor: not-allowed
    &:hover
      background-color: #ccc
.valid-feedback
  width: 100%
  color: green
  text-align: right
  font-size: 12px
  @media screen and (max-width: 768px)
    font-size: 10px

.invalid-feedback
  width: 100%
  color: #cf0000
  text-align: right
  font-size: 12px
  @media screen and (max-width: 768px)
    font-size: 10px
</style>
<style scoped lang="sass">
.links
  height: 57px
  cursor: pointer
.bg-layer
  background: rgba(0, 0, 0, 50%)
  min-height: 100vh
  padding-bottom: 50px

h1
  font-size: 45px
  color: #fff
  font-weight: 800
  text-transform: uppercase
  letter-spacing: 4px
  text-align: center
  padding: 1em 0 0.4em 0

.header-main
  max-width: 374px
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
  margin: 1em 0 0
  padding: .8em 1em
  background: rgba(255, 255, 255, 30%)
  color: black
  display: flex
  align-items: center
  justify-content: space-between
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

@keyframes slideleft
  from
    background-position: 0%
  to
    background-position: 90000%
</style>
<style scoped lang="sass">
.tips
  width: 100%
  font-size: 12px
  color: red
</style>
<style scoped lang="sass">
.valid-feedback
  width: 100%
  color: green
  text-align: right
  font-size: 12px
  @media screen and (max-width: 768px)
    font-size: 10px

.invalid-feedback
  width: 100%
  color: #cf0000
  text-align: right
  font-size: 12px
  @media screen and (max-width: 768px)
    font-size: 10px
.btn-submit
  &.disabled
    background-color: #ccc !important
    cursor: not-allowed !important
    &:hover
      background-color: #ccc !important
.input_style
  width:100%
  padding: 8px
  margin-left: 10px
  border: 1px solid black
  opacity: .4

.agreeCheck
  max-width: 450px
  width: 100%
  margin: 1rem auto 0 auto
  font-size: 1rem
  color: #000
  @media screen and (max-width: 768px)
    font-size: .95rem
  .icon
    display: inline
    color: #007bff
    cursor: pointer
</style>
