<!-- components/VideoPlayer.vue -->
<template>
  <div data-vjs-player>
    <video ref="videoPlayer" class="video-js vjs-big-play-centered vjs-fluid" :playsinline="playsinline" preload="auto"
      controls></video>
  </div>
</template>

<script>
// 1. 引入video.js和flvjs插件
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs-es6'; // 这会自动注册flvjs技术

// 引入Video.js的CSS（也可在nuxt.config.js中全局引入）
import 'video.js/dist/video-js.css';

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
    this.initializePlayer();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  methods: {
    initializePlayer() {
      // 2. 采用更安全的配置合并策略
      const defaultOptions = {
        controls: true,
        autoplay: false, // 默认不自动播放，避免浏览器策略限制
        muted: true,     // 如果需要自动播放，必须设置为true
        preload: 'auto',
        fluid: true,     // 自适应布局
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [],     // 默认空源，由父组件传入
        techOrder: ['html5', 'flvjs'], // 关键：指定使用flvjs技术
        flvjs: {
          // flv.js的配置选项
          enableWorker: true, // 启用worker提升性能
          enableStashBuffer: false, // 禁用stash buffer
          // mediaDataSource: {
          //   hasAudio: true,
          //   hasVideo: true
          // }
        }
      };

      // 深度合并配置，确保数组不被覆盖
      const mergedOptions = {
        ...defaultOptions,
        ...this.options,
        // 确保techOrder不会被父组件的空配置覆盖
        techOrder: this.options.techOrder || defaultOptions.techOrder,
        // 确保sources不会被父组件的空配置覆盖
        sources: this.options.sources && this.options.sources.length > 0
          ? this.options.sources
          : defaultOptions.sources
      };

      // 3. 打印最终配置用于调试（完成后可删除）
      console.log('[VideoPlayer] 最终配置:', mergedOptions);

      try {
        // 4. 初始化Video.js播放器
        this.player = videojs(this.$refs.videoPlayer, mergedOptions, () => {
          console.log('[VideoPlayer] 播放器已准备就绪');

          // 5. 添加详细的错误事件监听
          this.player.on('error', () => {
            const error = this.player.error();
            console.error('[VideoPlayer] 播放错误:');
            console.error('- 代码:', error.code);
            console.error('- 消息:', error.message);
            console.error('- 详细:', error);
          });

          // 监听其他有用的事件
          this.player.on('play', () => console.log('[VideoPlayer] 开始播放'));
          this.player.on('pause', () => console.log('[VideoPlayer] 暂停'));
          this.player.on('ended', () => console.log('[VideoPlayer] 播放结束'));
        });

      } catch (error) {
        console.error('[VideoPlayer] 初始化失败:', error);
      }
    }
  }
}
</script>

<style scoped>
/* 组件作用域样式 */
/* 确保播放器容器有基本尺寸 */
.video-js {
  width: 100%;
  max-width: 800px;
  height: 450px;
  background-color: #000;
}

/* 深度选择器修改Video.js默认样式（如果需要） */
::v-deep .vjs-big-play-button {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
</style>
