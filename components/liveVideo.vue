<!-- Nuxt.js优化的VideoPlayer组件 -->
<template>
  <div class="video-player-container-wrapper">
    <div class="video-player-container" :class="{ 'portrait-mode': portraitMode }">
      <div class="video-wrapper" data-vjs-player>
        <video ref="videoPlayer" class="video-js vjs-big-play-centered vjs-fluid" :playsinline="playsinline"
          preload="auto" controls :poster="poster"></video>
      </div>

      <!-- 加载状态指示器 -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在连接直播流...</div>
      </div>

      <!-- 错误状态显示 -->
      <div v-if="hasError" class="error-overlay">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ errorMessage }}</div>
        <button @click="retryConnection" class="retry-button">重新连接</button>
      </div>

      <!-- 自定义声音控制按钮 -->
      <div class="custom-sound-control">
        <button @click="toggleMute" class="sound-button" :class="{ 'muted': isMuted }"
          :title="isMuted ? '打开声音' : '关闭声音'">
          <svg v-if="isMuted" class="sound-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
          <svg v-else class="sound-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Nuxt.js环境下的导入方式
let videojs, flvjs
if (process.client) {
  videojs = require('video.js')
  require('video.js/dist/video-js.css')
  flvjs = require('videojs-flvjs-es6')
}

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
    },
    poster: {
      type: String,
      default: ''
    },
    streamUrl: {
      type: String,
      required: true
    },
    reconnectInterval: {
      type: Number,
      default: 5000
    },
    maxReconnectAttempts: {
      type: Number,
      default: 5
    },
    portraitMode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      player: null,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      reconnectAttempts: 0,
      reconnectTimer: null,
      isPageVisible: true,
      connectionTimeout: null,
      isMuted: true,
      visibilityChangeHandler: null
    }
  },
  mounted() {
    // Nuxt.js中使用$nextTick确保DOM完全渲染
    this.$nextTick(() => {
      this.setupPageVisibilityListener()
      this.initializePlayer()
    })
  },
  beforeDestroy() {
    this.cleanup()
  },
  watch: {
    streamUrl: {
      handler(newUrl) {
        if (newUrl && this.player) {
          this.retryConnection()
        }
      },
      immediate: false
    }
  },
  methods: {
    initializePlayer() {
      // 确保在客户端环境
      if (!process.client || !videojs) {
        console.warn('[VideoPlayer] 仅在客户端环境运行')
        return
      }

      this.isLoading = true
      this.hasError = false

      // 优化的FLV配置，解决HTTP2和Early-EOF错误
      const defaultOptions = {
        controls: false,
        autoplay: true,
        muted: true,
        preload: 'auto',
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: this.options.sources && this.options.sources.length > 0
          ? this.options.sources
          : [{
            src: this.streamUrl,
            type: 'video/flv'
          }],
        techOrder: ['flvjs', 'html5'],
        flvjs: {
          // 解决HTTP2和Early-EOF错误的配置
          enableWorker: false, // 禁用Worker避免兼容性问题
          enableStashBuffer: true, // 启用缓冲区
          stashInitialSize: 128, // 减小初始缓冲区
          autoCleanupSourceBuffer: true,
          autoCleanupMaxBackwardDuration: 30,
          autoCleanupMinBackwardDuration: 10,
          isLive: true,
          cors: true,
          withCredentials: false,
          // 添加重试配置
          enableWorker: false,
          enableStashBuffer: true,
          stashInitialSize: 128,
          // 解决Early-EOF的配置
          fixAudioTimestampGap: true,
          accurateSeek: false,
          seekType: 'range',
          // 网络配置
          rangeLoadZeroStart: false,
          customSeekHandler: undefined,
          // 错误处理
          enableWorker: false,
          enableStashBuffer: true,
          stashInitialSize: 128
        }
      }

      const mergedOptions = {
        ...defaultOptions,
        ...this.options,
        techOrder: this.options.techOrder || defaultOptions.techOrder,
        sources: this.options.sources && this.options.sources.length > 0
          ? this.options.sources
          : defaultOptions.sources
      }

      console.log('[VideoPlayer] 初始化播放器，配置:', mergedOptions)

      try {
        this.player = videojs(this.$refs.videoPlayer, mergedOptions, () => {
          console.log('[VideoPlayer] 播放器已准备就绪')
          this.setupPlayerEvents()
        })
      } catch (error) {
        console.error('[VideoPlayer] 初始化失败:', error)
        this.handleError('播放器初始化失败', error)
      }
    },

    setupPlayerEvents() {
      if (!this.player) return

      this.setConnectionTimeout()

      // 错误处理
      this.player.on('error', () => {
        const error = this.player.error()
        console.error('[VideoPlayer] 播放错误:', error)
        this.handleError('播放错误', error)
      })

      // 播放事件
      this.player.on('play', () => {
        console.log('[VideoPlayer] 开始播放')
        this.isLoading = false
        this.hasError = false
        this.reconnectAttempts = 0
        this.clearConnectionTimeout()
      })

      this.player.on('canplay', () => {
        console.log('[VideoPlayer] 可以播放')
        this.isLoading = false
        this.hasError = false
        this.clearConnectionTimeout()
      })

      this.player.on('waiting', () => {
        console.log('[VideoPlayer] 等待数据')
        this.isLoading = true
      })

      this.player.on('stalled', () => {
        console.log('[VideoPlayer] 数据停滞')
        this.handleError('数据加载停滞')
      })

      this.player.on('timeout', () => {
        console.log('[VideoPlayer] 连接超时')
        this.handleError('连接超时')
      })

      // 直播状态事件
      this.player.on('ended', () => {
        console.log('[VideoPlayer] 播放结束')
        this.handleStreamEnd()
      })

      this.player.on('loaderror', () => {
        console.log('[VideoPlayer] 加载错误')
        this.handleError('网络连接失败')
      })

      this.player.on('emptied', () => {
        console.log('[VideoPlayer] 媒体资源清空')
        this.handleStreamDisconnect()
      })
    },

    // 连接超时处理
    setConnectionTimeout() {
      this.clearConnectionTimeout()
      this.connectionTimeout = setTimeout(() => {
        if (this.isLoading) {
          this.handleError('连接超时，正在重试...')
        }
      }, 15000) // 增加到15秒
    },

    clearConnectionTimeout() {
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout)
        this.connectionTimeout = null
      }
    },

    // 错误处理
    handleError(message, error = null) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = message

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect()
      }
    },

    // 处理直播结束
    handleStreamEnd() {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = '直播已结束'
      this.clearConnectionTimeout()
      this.clearReconnectTimer()
    },

    // 处理直播断开
    handleStreamDisconnect() {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = '直播连接断开，正在重连...'

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect()
      } else {
        this.errorMessage = '直播连接失败，请检查网络或稍后重试'
      }
    },

    // 网络状态检查
    checkNetworkStatus() {
      if (process.client && navigator.onLine === false) {
        this.handleError('网络连接已断开，请检查网络设置')
        return false
      }
      return true
    },

    // 增强重连机制
    scheduleReconnect() {
      if (!this.checkNetworkStatus()) {
        return
      }

      this.reconnectAttempts++
      const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1), 3000)
      console.log(`[VideoPlayer] 第${this.reconnectAttempts}次重连尝试，${delay / 1000}秒后重试`)

      this.reconnectTimer = setTimeout(() => {
        this.retryConnection()
      }, delay)
    },

    // 重试连接
    retryConnection() {
      if (!this.isPageVisible) {
        console.log('[VideoPlayer] 页面不可见，跳过重连')
        return
      }

      this.clearConnectionTimeout()
      this.clearReconnectTimer()

      if (this.player) {
        this.player.dispose()
        this.player = null
      }

      this.$nextTick(() => {
        this.initializePlayer()
      })
    },

    clearReconnectTimer() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    },

    // 页面可见性监听
    setupPageVisibilityListener() {
      if (!process.client) return

      const handleVisibilityChange = () => {
        this.isPageVisible = !document.hidden

        if (this.isPageVisible) {
          console.log('[VideoPlayer] 页面变为可见，恢复播放')
          if (this.player && this.player.paused()) {
            this.player.play().catch(error => {
              console.log('[VideoPlayer] 自动播放失败，需要用户交互')
            })
          }
        } else {
          console.log('[VideoPlayer] 页面变为隐藏，暂停播放')
          if (this.player && !this.player.paused()) {
            this.player.pause()
          }
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      this.visibilityChangeHandler = handleVisibilityChange
    },

    // 声音控制
    toggleMute() {
      if (this.player) {
        this.isMuted = !this.isMuted
        this.player.muted(this.isMuted)
        console.log(`[VideoPlayer] 声音${this.isMuted ? '关闭' : '打开'}`)
      }
    },

    // 清理资源
    cleanup() {
      if (this.visibilityChangeHandler && process.client) {
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler)
      }

      this.clearConnectionTimeout()
      this.clearReconnectTimer()

      if (this.player) {
        this.player.dispose()
        this.player = null
      }
    }
  }
}
</script>

<style scoped>
/* 保持原有的样式不变 */
.video-player-container-wrapper {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  border-radius: 12px;
  padding: 8px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.video-player-container-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}

.video-player-container-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

.video-player-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  z-index: 2;
}

.video-player-container.portrait-mode {
  max-width: 400px;
  margin: 0 auto;
  aspect-ratio: 9/16;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-js {
  width: 100% !important;
  height: 100% !important;
  background-color: #000;
}

.video-js .vjs-tech {
  width: 100%;
  height: 100%;
}

/* 隐藏默认UI */
::v-deep .vjs-big-play-button {
  display: none !important;
}

::v-deep .vjs-control-bar {
  display: none !important;
}

::v-deep .vjs-loading-spinner {
  display: none !important;
}

::v-deep .vjs-loading-spinner:before {
  display: none !important;
}

::v-deep .vjs-loading-spinner:after {
  display: none !important;
}

::v-deep .vjs-waiting {
  display: none !important;
}

::v-deep .vjs-seeking {
  display: none !important;
}

::v-deep .vjs-loading {
  display: none !important;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-text {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.4;
}

.retry-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #0056b3;
}

/* 声音控制按钮 */
.custom-sound-control {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 51;
}

.sound-button {
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.sound-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.sound-button.muted {
  background-color: rgba(255, 0, 0, 0.6);
}

.sound-button.muted:hover {
  background-color: rgba(255, 0, 0, 0.8);
}

.sound-icon {
  width: 20px;
  height: 20px;
  color: #fff;
  transition: color 0.3s ease;
}

.sound-button:hover .sound-icon {
  color: #007bff;
}

.sound-button.muted:hover .sound-icon {
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-player-container-wrapper {
    background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    height: 100vh;
  }

  .video-player-container.portrait-mode {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    height: 100vh;
    aspect-ratio: unset;
  }

  .custom-sound-control {
    top: 15px;
    right: 15px;
  }

  .sound-button {
    width: 45px;
    height: 45px;
  }

  .sound-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
