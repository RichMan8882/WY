<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
// 台灣數據
import taiwan from '@/assets/js/taiwanAddress.js';
import taiwanData from "@/assets/js/taiwanData.js"
const addrInfo = ref({
  id: 0,
  province: '台灣',
  city: '臺北市',
  county: '中山區',
  provinceCode: 710000,
  cityCode: 710100,
  countyCode: 710101,
  fullLocation: '',
  areaLabel: [710000, 710100, 710101],
  phoneNumber: '',
  isDefault: false,
  name: ''
})

const addrList = ref([
  {
    id: 1,
    province: '台灣',
    provinceCode: 710000,
    city: '臺北市',
    cityCode: 710100,
    county: '中山區',
    countyCode: 710101,
    fullLocation: '台北市中山區中正路1號',
    areaLabel: [710000, 710100, 710101],
    phoneNumber: '0912345678',
    isDefault: true,
    name: '王小明'
  },
  {
    id: 2,
    province: '台灣',
    provinceCode: 710000,
    city: '臺北市',
    cityCode: 710100,
    county: '中山區',
    countyCode: 710101,
    fullLocation: '台北市中山區中正路1號',
    areaLabel: [710000, 710100, 710101],
    phoneNumber: '0912345678',
    isDefault: false,
    name: '王二明'
  },
  {
    id: 3,
    province: '台灣',
    provinceCode: 710000,
    city: '臺北市',
    cityCode: 710100,
    county: '中山區',
    countyCode: 710101,
    fullLocation: '台北市中山區中正路1號',
    areaLabel: [710000, 710100, 710101],
    phoneNumber: '0912345678',
    isDefault: false,
    name: '王大明'
  }
])

const expand = {
  expandTrigger: 'hover' as const,
}
const { t } = useI18n()
const router = useRouter()
const scrollTop = ref(0)
const section1 = ref<HTMLElement | null>(null)
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
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})


function addressChange(arr: any) {
  addrInfo.value.provinceCode = arr[0]
  addrInfo.value.cityCode = arr[1]
  addrInfo.value.countyCode = arr[2]
  addrInfo.value.province = taiwanData[arr[0]]
  addrInfo.value.city = taiwanData[arr[1]]
  addrInfo.value.county = taiwanData[arr[2]]
  console.log(addrInfo.value);

}
const showAddr = ref(false)

const onShowAddr = (obj?: any) => {
  if (obj) {
    addrInfo.value = JSON.parse(JSON.stringify(obj))
  }
  showAddr.value = !showAddr.value
}

const onClose = () => {
  showAddr.value = false
}

const onSave = () => {
  if (!addrInfo.value.name) {
    return ElMessage({ message: '請填寫收貨人', type: 'error' })
  }
  if (!addrInfo.value.phoneNumber) {
    return ElMessage({ message: '請填寫手機號碼', type: 'error' })
  }
  if (!addrInfo.value.provinceCode || !addrInfo.value.cityCode || !addrInfo.value.countyCode) {
    return ElMessage({ message: '請選擇省市區', type: 'error' })
  }
  if (!addrInfo.value.fullLocation) {
    return ElMessage({ message: '請填寫詳細收貨地址', type: 'error' })
  }
  if (addrInfo.value.id) {
    // 使用 findIndex 查找匹配的索引
    const index = addrList.value.findIndex(item => item.id === addrInfo.value.id);
    addrList.value.splice(index, 1, addrInfo.value)
  } else {
    addrList.value.unshift(addrInfo.value)
  }
  console.log(addrInfo.value);

  onClose()
}

const onDelete = (delObj: any) => {
  console.log(addrList.value);

  if (delObj.id) {
    // 使用 findIndex 查找匹配的索引
    const index = addrList.value.findIndex(item => item.id === delObj.id);
    addrList.value.splice(index, 1)
  } else {
    ElMessage({ message: '請選擇要刪除的收貨地址', type: 'error' })
  }
}

const onDefault = (defObj: any) => {
  const index = addrList.value.findIndex(item => item.id === defObj.id);
  addrList.value[index].isDefault = true
  addrList.value.forEach((item: any) => {
    if (item.id !== defObj.id) {
      item.isDefault = false
    }
  })
}

</script>
<template>
  <div class="cont">
    <headerTop :opaque="scrollTop >= 0"></headerTop>
    <section class="section1" ref="section1">
      <div class="section1-tit">
        <h2>
          <span>地址列表</span>
        </h2>
        <svg t="1756629334128" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="6083" width="20" height="20" @click="onShowAddr">
          <path
            d="M184 184h656v656H184V184z m-40-72c-17.673 0-32 14.327-32 32v736c0 17.673 14.327 32 32 32h736c17.673 0 32-14.327 32-32V144c0-17.673-14.327-32-32-32H144z"
            fill="#707070" p-id="6084"></path>
          <path d="M256 488a8 8 0 0 1 8-8h496a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8H264a8 8 0 0 1-8-8v-48z" fill="#707070"
            p-id="6085"></path>
          <path d="M488 768a8 8 0 0 1-8-8V264a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v496a8 8 0 0 1-8 8h-48z" fill="#707070"
            p-id="6086"></path>
        </svg>
      </div>
      <div class="section1-content">
        <div class="section1-content-items">
          <div class="is-null" v-if="addrList.length === 0">
            <h3><span>還沒有地址，點擊</span>
              <svg t="1756629334128" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="6083" width="20" height="20" @click="onShowAddr">
                <path
                  d="M184 184h656v656H184V184z m-40-72c-17.673 0-32 14.327-32 32v736c0 17.673 14.327 32 32 32h736c17.673 0 32-14.327 32-32V144c0-17.673-14.327-32-32-32H144z"
                  fill="#707070" p-id="6084"></path>
                <path d="M256 488a8 8 0 0 1 8-8h496a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8H264a8 8 0 0 1-8-8v-48z"
                  fill="#707070" p-id="6085"></path>
                <path d="M488 768a8 8 0 0 1-8-8V264a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v496a8 8 0 0 1-8 8h-48z"
                  fill="#707070" p-id="6086"></path>
              </svg>
              <span>添加</span>
            </h3>

          </div>
          <div class="content-item" v-for="(item, index) in addrList">
            <div class="addr-cont">
              <div class="item-tit">
                <h3 @click="onShowAddr(item)">
                  <span class="item-tit-name">{{ item.name }}</span>&nbsp;
                  <span class="item-tit-phone"> {{ item.phoneNumber }}</span>
                </h3>
              </div>
              <div class="item-cont">
                <div class="item-cont-text">
                  <div class="item-cont-text-item">
                    <span class="item-cont-text-item-tit">地址：</span>
                    <span class="item-cont-text-item-cont">
                      {{ item.province }}
                      {{ item.city }}
                      {{ item.county }}
                      {{ item.fullLocation }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="edit-del">
              <span class="edit-icon" @click="onShowAddr(item)">
                <!-- 修改 -->
                <svg t="1756277399813" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="18724" width="20" height="20">
                  <path
                    d="M846.9 511.7v279.9c0 33.6-22.4 56-56 56H231.2c-33.6 0-56-22.4-56-56V231.8c0-33.6 22.4-56 56-56h279.9c33.6 0 56-22.4 56-56s-22.4-56-56-56H231.2c-95.2 0-167.9 72.8-167.9 167.9v559.8c0 95.2 72.8 167.9 167.9 167.9H791c95.2 0 167.9-72.8 167.9-167.9V511.7c0-33.6-22.4-56-56-56s-56 22.4-56 56z m-459 67.2c-22.4-22.4-22.4-56 0-78.4L785.4 103c22.4-22.4 56-22.4 78.4 0 22.4 22.4 22.4 56 0 78.4L466.3 578.9c-22.4 22.4-61.6 22.4-78.4 0z m0 0"
                    p-id="18725"></path>
                </svg>
              </span>

              <span class="delete" @click="onDelete(item)">
                <!-- <span>刪除</span> -->
                <svg t="1756277951339" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="19730" width="20" height="20">
                  <path
                    d="M401.066667 805.262222a45.511111 45.511111 0 0 0 45.312-45.511111v-275.342222a45.340444 45.340444 0 1 0-90.652445 0v275.342222a45.511111 45.511111 0 0 0 45.340445 45.511111z m221.866666 0a45.511111 45.511111 0 0 0 45.340445-45.511111v-275.342222a45.340444 45.340444 0 1 0-90.652445 0v275.342222a45.511111 45.511111 0 0 0 45.312 45.511111zM458.837333 102.4h106.296889a45.511111 45.511111 0 0 0 0-91.022222h-106.296889a45.511111 45.511111 0 0 0-0.142222 91.022222zM944.64 197.973333H79.36a45.511111 45.511111 0 0 0 0 91.022223h28.444444v561.777777a161.422222 161.422222 0 0 0 160.739556 161.848889h486.627556a161.422222 161.422222 0 0 0 160.739555-161.848889V288.995556h28.444445a45.511111 45.511111 0 0 0 0.142222-91.022223z m-119.239111 652.8a70.599111 70.599111 0 0 1-70.087111 70.826667H268.544a70.599111 70.599111 0 0 1-70.087111-70.826667V288.995556h626.801778v561.777777z"
                    p-id="19731"></path>
                </svg>

              </span>
              <span class="default" @click="onDefault(item)" v-if="addrList.length != 1">
                <!-- 設爲默認 -->
                <svg t="1756127933796" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="8443" width="20" height="20" v-if="!item.isDefault">
                  <path
                    d="M512 0C228.072727 0 0 228.072727 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0m0 46.545455c256 0 465.454545 209.454545 465.454545 465.454545s-209.454545 465.454545-465.454545 465.454545S46.545455 768 46.545455 512 256 46.545455 512 46.545455"
                    p-id="8444"></path>
                  <path
                    d="M512 777.309091h-9.309091c-146.618182-4.654545-260.654545-128-253.672727-274.618182 4.654545-146.618182 128-260.654545 274.618182-253.672727 20.945455 0 44.218182 4.654545 62.836363 9.309091 11.636364 4.654545 18.618182 16.290909 16.290909 27.927272-4.654545 11.636364-16.290909 18.618182-27.927272 16.29091-16.290909-4.654545-34.909091-6.981818-53.527273-9.309091-121.018182-4.654545-221.090909 88.436364-225.745455 209.454545-4.654545 121.018182 88.436364 221.090909 209.454546 225.745455 121.018182 4.654545 221.090909-88.436364 225.745454-209.454546 0-20.945455-2.327273-39.563636-6.981818-60.509091-2.327273-11.636364 4.654545-25.6 16.290909-27.927272 11.636364-2.327273 25.6 4.654545 27.927273 16.290909 4.654545 23.272727 9.309091 48.872727 6.981818 72.145454-4.654545 146.618182-121.018182 258.327273-262.981818 258.327273"
                    p-id="8445"></path>
                  <path
                    d="M686.545455 307.2c-18.618182 0-34.909091 16.290909-34.909091 34.909091s16.290909 34.909091 34.909091 34.909091 34.909091-16.290909 34.90909-34.909091-16.290909-34.909091-34.90909-34.909091"
                    p-id="8446"></path>
                </svg>
                <svg t="1756278069094" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="23405" width="20" height="20" v-if="item.isDefault">
                  <path
                    d="M512 512m-488.727273 0a488.727273 488.727273 0 1 0 977.454546 0 488.727273 488.727273 0 1 0-977.454546 0Z"
                    fill="#FFFFFF" p-id="23406"></path>
                  <path
                    d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m0-977.454545C256 46.545455 46.545455 256 46.545455 512s209.454545 465.454545 465.454545 465.454545 465.454545-209.454545 465.454545-465.454545S768 46.545455 512 46.545455z"
                    fill="#baa38f" p-id="23407"></path>
                  <path
                    d="M512 512m-325.818182 0a325.818182 325.818182 0 1 0 651.636364 0 325.818182 325.818182 0 1 0-651.636364 0Z"
                    fill="#baa38f" p-id="23408"></path>
                </svg>
                <span>{{ item.isDefault ? '默認　　' : '設爲默認' }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div :class="showAddr ? 'popup-contact' : ''" @click.self="onClose">
      <!-- 表單提交 -->
      <div class="modal-body" :class="showAddr ? 'modal-body-active' : ''">
        <div class="msg-form">
          <div class="message-shop">
            <div class="message-title">
              {{ addrInfo.name && addrInfo.phoneNumber ? "修改地址" : "新增地址" }}
            </div>

            <div class="contact-info">
              <div class="form-group">
                <div class="controls">
                  <input class="form-control " v-model="addrInfo.name" placeholder="輸入收件人姓名" type="text">
                </div>
                <p class="help-block hide">
                  收件人 是必須的
                </p>
              </div>
              <div class="form-group">
                <div class="controls">
                  <input class="form-control " v-model="addrInfo.phoneNumber" placeholder="輸入收件人電話" type="tel">
                </div>
                <p class="help-block hide">
                  電話 是必須的
                </p>
              </div>
              <div class="form-group">
                <el-cascader @change="addressChange" v-model='addrInfo.areaLabel' :options="taiwan" :props="expand"
                  clearable></el-cascader>
              </div>
              <div class="form-group">
                <div class="controls">
                  <textarea class="form-control text-area" name="message_text" placeholder="詳細地址，例 xx街01號"
                    v-model="addrInfo.fullLocation"></textarea>
                </div>
                <p class="help-block hide">
                  詳細地址 是必須的
                </p>
              </div>
              <div class="text-right">
                <button class="sub-btn" @click="onSave">
                  保存
                </button>
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
.cont
  background: #fff !important
  padding-top: 147.5px
  @media (max-width: 768px)
    padding-top: 110px

.section1
  width: 1170px
  max-width: 100%
  margin: 0 auto
  padding: 30px 15px
  .section1-tit
    margin-top: 25px
    display: flex
    align-items: center
    gap: 10px
    .icon
      width: 26px
      height: 26px
      cursor: pointer
      &:hover
        color: #baa38f
        fill: #baa38f !important
  .section1-content
    margin-top: 60px
    margin-bottom: 60px
    .section1-content-items
      border-block: 1px solid #e5e5e5
      .content-item
        padding: 15px 20px
        border-block-end: 1px solid #e5e5e5
        display: flex
        justify-content: space-between
        align-items: center
        &:last-child
          border-block-end: none
        .edit-del
          display: flex
          align-items: center
          gap: 20px
          .edit-icon,.delete,.default
            display: flex
            align-items: center
            gap: 10px
            padding: 3px 0
            font-size: 14px
            transition: all .2s ease
            .icon
              width: 15px
              height: 15px
              fill: #3D3D3D 
            &:hover
              color: #baa38f
              .icon
                fill: #baa38f !important
                color: #baa38f !important
          .edit-icon
            .icon
              fill: #101010
          .default-active
            color: #baa38f
            font-weight: 700
            .icon
              fill: #baa38f
              color: #baa38f !important
          .delete .icon
            fill: #af3349 !important
        .item-tit
          font-weight: 700
@media (max-width: 768px)
  .content-item
    flex-direction: column
    align-items: flex-start !important


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
      font-size: 18px
      color: #101010
      margin-bottom: 15px
    .contact-info
      .form-group
        :deep(.el-cascader)
          width: 100% !important
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
  max-width: 90%
  width: 720px
  opacity: 1 !important
  top: 40% !important
  left: 50% !important
  transform: translate(-50%, -50%) !important
  transition: all 0.3s ease

.is-null
  margin: 80px auto
  width: 100%
  text-align: center
  h3
    display: flex
    align-items: center
    justify-content: center
    gap: 10px
    .icon
      cursor: pointer
      width: 25px
      height: 25px
</style>
