<script lang="ts" setup>
const { t } = useI18n()
const siteStore = useSiteStore()
const PlayerStore = usePlayerStore()
const orderStore = useOrderStore()
const { queryKlines, queryRounds, queryOrder, bet } = useGameStore()
const { getListenkey } = PlayerStore
const { locale } = useI18n()
const lang = locale.value
const { queryInstruction, queryNews } = useSiteStore()
const router = useRouter()
const videoOptions = {
  sources: [{
    src: 'https://synaptiqh.com/live/livestream.flv',
    type: 'video/flv' // 类型必须正确
  }],
  autoplay: true,   // 是否自动播放
  muted: true,      // 自动播放时必须为true
  techOrder: ['flvjs'] // 明确指定使用flvjs技术
}
const streamUrl = siteStore.siteData?.logo || ''
</script>
<template>
  <div class="cont">
    <liveVideo :options="videoOptions" :streamUrl="streamUrl" />
    <section class="chatlayer" ref="section1">
      <div class="chat">
        <div class="goback">
          <div class="back">{{ '主頁' }}</div>
        </div>
        <div class="chat-lis">
          <div class="chat-item">
            <div class="chat-item-img">
              <img src="https://picsum.photos/200/300" alt="">
            </div>
            <div class="chat-item-text">
              <div class="chat-text" v-if="true">
                {{ '哈哈哈，早知道' }}
              </div>
              <div class="chat-text-img" v-else>
                <img src="https://picsum.photos/200/300" alt=""></img>
              </div>
            </div>
          </div>
          <div class="chat-input">
            <input type="text" maxlength="100" placeholder="請輸入聊天內容"></input>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped lang="sass">
.cont
  height: 100vh
  position: relative
  .chatlayer
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 99
    .chat
      max-width: 400px
      height: 100%
      margin: 0 auto
      .goback
        height: 45px
        padding: 15px 15px
        .back
          display: inline-block
          font-size: 12px
          border-radius: 25px
          padding: 2px 10px
          text-align: center
          color: #fff
          background: rgba(0,0,0,0.5)
          cursor: pointer
          transition: all .3s ease
          border: 1px solid rgba(255,255,255,0.6)
          &:hover
            background: rgba(0,0,0,0.7)
      .chat-lis
        height: calc(100vh - 45px)
        overflow-y: auto
        .chat-item
          display: flex
          padding: 10px
          align-items: flex-start
          .chat-item-img
            width: 40px
            height: 40px
            border-radius: 50%
            overflow: hidden
            img
              width: 100%
              height: 100%
              object-fit: cover
          .chat-item-text
            padding: 10px
          .chat-text-img
            height: 80px
            max-width: 50%
            img
              object-fit: contain
              height: 100%
</style>
