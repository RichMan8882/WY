<template>
  <div data-vjs-player> <!-- 这个容器有助于防止潜在布局问题 -->
    <video ref="videoPlayer" class="video-js vjs-big-play-centered vjs-fluid" :playsinline="playsinline" preload="auto"
      controls></video>
  </div>
</template>

<script>
// 在组件内部引入video.js和flvjs插件
import videojs from 'video.js'
import 'videojs-flvjs-es6' // 这会自动注册flvjs技术

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
    this.initializePlayer()
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    initializePlayer() {
      // 合并默认选项和传入的选项
      const mergedOptions = {
        controls: true,
        autoplay: false, // 建议先设为false，让用户交互后播放，避免浏览器策略限制
        preload: 'auto',
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [],
        // ！！！ 关键配置：指定使用flvjs技术来播放 ！！！
        techOrder: ['html5', 'flvjs'], // 优先尝试使用flvjs，如果不支持再回退到其他技术
        flvjs: {
          // flv.js的配置选项，例如：
          // mediaDataSource: {
          //   hasAudio: true,
          //   hasVideo: true
          // }
        },
        ...this.options // 你的配置（如sources）会覆盖上面的默认值
      }

      // 初始化Video.js播放器
      this.player = videojs(this.$refs.videoPlayer, mergedOptions, function onPlayerReady() {
        console.log('播放器已准备就绪，使用技术:', this.techName_); // 这里应该会输出 'flvjs'
        this.on('error', () => {
          console.error('播放器错误:', this.error());
        });
      })
    }
  }
}
</script>

<style scoped>
/* 你可以在这里添加一些组件作用域的样式 */
/* 如果需要覆盖Video.js默认样式，可以考虑使用深度选择器 >>> 或 /deep/ 或 ::v-deep，但要谨慎 */
</style>
