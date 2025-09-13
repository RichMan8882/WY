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
</style>
