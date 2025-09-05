<template>
  <div data-vjs-player> <!-- 这个容器有助于防止潜在布局问题 -->
    <video ref="videoPlayer" class="video-js vjs-big-play-centered vjs-fluid" :playsinline="playsinline" preload="auto"
      controls></video>
  </div>
</template>

<script>
// 在组件内部引入video.js，确保仅在客户端使用
import videojs from 'video.js'
// 如果需要在组件级别引入HLS等插件，也可以在这里import
// import 'videojs-contrib-hls'

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    playsinline: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    // 确保在mounted钩子中初始化，因为此时DOM已挂载且只在客户端执行
    this.initializePlayer()
  },
  beforeDestroy() {
    // 组件销毁前，务必销毁播放器实例，释放资源
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    initializePlayer() {
      // 合并默认选项和传入的选项
      const mergedOptions = {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true, // 使播放器自适应容器大小
        playbackRates: [0.5, 1, 1.5, 2], // 播放速率选项
        sources: [], // 视频源
        ...this.options
      }

      // 初始化Video.js播放器
      this.player = videojs(this.$refs.videoPlayer, mergedOptions, function onPlayerReady() {
        console.log('播放器已准备就绪')
        // 你可以在这里监听播放器事件
        this.on('play', () => {
          console.log('视频开始播放')
        })
        this.on('pause', () => {
          console.log('视频已暂停')
        })
        this.on('ended', () => {
          console.log('视频播放结束')
        })
      })
    }
  }
}
</script>

<style scoped>
/* 你可以在这里添加一些组件作用域的样式 */
/* 如果需要覆盖Video.js默认样式，可以考虑使用深度选择器 >>> 或 /deep/ 或 ::v-deep，但要谨慎 */
</style>
