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

</script>
<template>
  <div class="cont">
    <liveVideo />
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
    z-index: 50
    .chat
      max-width: 400px
      height: 100%
      margin: 0 auto
      position: relative
      .goback
        height: 45px
        padding: 15px 15px
        display: flex
        align-items: center
        justify-content: space-between
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
      .chat-btm
        position: absolute
        bottom: 0
        left: 0
        right: 0
        padding: 20px 10px 45px
        overflow-y: auto
      .chat-lis
        display: flex
        flex-direction: column-reverse
        align-items: self-start
        margin: 10px 0
        max-height: calc(360px)
        overflow-y: auto
        mask-image: -webkit-gradient(linear, left 10%, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))
        -webkit-mask-image: -webkit-gradient(linear, left 10%, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))
        .chat-item
          display: flex
          padding: 3px 10px
          margin-block: 2px
          align-items: flex-start
          color: #fff
          font-size: 12px
          background: rgba(0, 0, 0, .2)
          border-radius: 10px
          max-width: 100%
          .chat-title
            color: #00ffff
            max-width: 40%
            flex-shrink: 0
            display: flex
            .title-user
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
          .chat-item-img
            width: 40px
            min-width: 40px
            height: 40px
            border-radius: 50%
            overflow: hidden
            border: 1px solid #888
            img
              width: 100%
              height: 100%
              object-fit: cover
          .chat-item-text
            padding-left: 5px
            flex: 1
          .chat-text-img
            height: 80px
            max-width: 50%
            img
              object-fit: contain
              height: 100%s
      .chat-input
        position: sticky
        bottom: 0
        input
          width: 100%
          height: 40px
          line-height: 40px
          background: rgba(0,0,0,0.5)
          border-radius: 25px
          border: 1px solid rgba(255,255,255,0.6)
          padding: 10px
          color: #fff
</style>
