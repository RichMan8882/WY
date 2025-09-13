<!-- components/VideoPlayer.vue -->
<template>
  <div class="video-player-container">
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
      connectionTimeout: null
    }
  },
  mounted() {
    this.setupPageVisibilityListener();
    this.initializePlayer();
  },
  beforeDestroy() {
    this.cleanup();
  },
  watch: {
    streamUrl: {
      handler(newUrl) {
        if (newUrl && this.player) {
          this.retryConnection();
        }
      },
      immediate: false
    }
  },
  methods: {
    initializePlayer() {
      this.isLoading = true;
      this.hasError = false;

      // 2. 采用更安全的配置合并策略
      const defaultOptions = {
        controls: true,
        autoplay: true, // 默认自动播放，与您的配置保持一致
        muted: true,     // 如果需要自动播放，必须设置为true
        preload: 'auto',
        fluid: true,     // 自适应布局
        playbackRates: [0.5, 1, 1.5, 2],
        sources: this.options.sources && this.options.sources.length > 0
          ? this.options.sources
          : [{
            src: this.streamUrl,
            type: 'video/flv'
          }],
        techOrder: ['flvjs', 'html5'], // 优先使用flvjs技术
        flvjs: {
          // flv.js的配置选项
          enableWorker: true, // 启用worker提升性能
          enableStashBuffer: false, // 禁用stash buffer
          autoCleanupSourceBuffer: true, // 自动清理缓冲区
          autoCleanupMaxBackwardDuration: 30, // 最大向后清理时长
          autoCleanupMinBackwardDuration: 10, // 最小向后清理时长
          stashInitialSize: 384, // 初始缓冲区大小
          isLive: true, // 标记为直播流
          cors: true,
          withCredentials: false
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
          this.setupPlayerEvents();
        });

      } catch (error) {
        console.error('[VideoPlayer] 初始化失败:', error);
        this.handleError('播放器初始化失败', error);
      }
    },

    // 设置播放器事件监听
    setupPlayerEvents() {
      if (!this.player) return;

      // 设置连接超时
      this.setConnectionTimeout();

      // 5. 添加详细的错误事件监听
      this.player.on('error', () => {
        const error = this.player.error();
        console.error('[VideoPlayer] 播放错误:');
        console.error('- 代码:', error.code);
        console.error('- 消息:', error.message);
        console.error('- 详细:', error);

        this.handleError('播放错误', error);
      });

      // 监听其他有用的事件
      this.player.on('play', () => {
        console.log('[VideoPlayer] 开始播放');
        this.isLoading = false;
        this.hasError = false;
        this.reconnectAttempts = 0;
        this.clearConnectionTimeout();
      });

      this.player.on('pause', () => {
        console.log('[VideoPlayer] 暂停');
      });

      this.player.on('ended', () => {
        console.log('[VideoPlayer] 播放结束');
      });

      this.player.on('loadstart', () => {
        console.log('[VideoPlayer] 开始加载');
        this.isLoading = true;
      });

      this.player.on('canplay', () => {
        console.log('[VideoPlayer] 可以播放');
        this.isLoading = false;
        this.hasError = false;
        this.clearConnectionTimeout();
      });

      this.player.on('waiting', () => {
        console.log('[VideoPlayer] 等待数据');
        this.isLoading = true;
      });

      this.player.on('stalled', () => {
        console.log('[VideoPlayer] 数据停滞');
        this.handleError('数据加载停滞');
      });

      this.player.on('timeout', () => {
        console.log('[VideoPlayer] 连接超时');
        this.handleError('连接超时');
      });
    },

    // 设置连接超时
    setConnectionTimeout() {
      this.clearConnectionTimeout();
      this.connectionTimeout = setTimeout(() => {
        if (this.isLoading) {
          this.handleError('连接超时，正在重试...');
        }
      }, 10000); // 10秒超时
    },

    // 清除连接超时
    clearConnectionTimeout() {
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
    },

    // 处理错误
    handleError(message, error = null) {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = message;

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    },

    // 安排重连
    scheduleReconnect() {
      this.reconnectAttempts++;
      console.log(`[VideoPlayer] 第${this.reconnectAttempts}次重连尝试，${this.reconnectInterval / 1000}秒后重试`);

      this.reconnectTimer = setTimeout(() => {
        this.retryConnection();
      }, this.reconnectInterval);
    },

    // 重试连接
    retryConnection() {
      if (!this.isPageVisible) {
        console.log('[VideoPlayer] 页面不可见，跳过重连');
        return;
      }

      this.clearConnectionTimeout();
      this.clearReconnectTimer();

      if (this.player) {
        this.player.dispose();
        this.player = null;
      }

      // 重新初始化播放器
      this.$nextTick(() => {
        this.initializePlayer();
      });
    },

    // 清除重连定时器
    clearReconnectTimer() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    },

    // 设置页面可见性监听
    setupPageVisibilityListener() {
      const handleVisibilityChange = () => {
        this.isPageVisible = !document.hidden;

        if (this.isPageVisible) {
          console.log('[VideoPlayer] 页面变为可见，恢复播放');
          // 页面重新可见时，如果播放器存在且暂停，则尝试恢复
          if (this.player && this.player.paused()) {
            this.player.play().catch(error => {
              console.log('[VideoPlayer] 自动播放失败，需要用户交互');
            });
          }
        } else {
          console.log('[VideoPlayer] 页面变为隐藏，暂停播放');
          // 页面隐藏时暂停播放以节省资源
          if (this.player && !this.player.paused()) {
            this.player.pause();
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // 存储事件监听器以便清理
      this.visibilityChangeHandler = handleVisibilityChange;
    },

    // 清理资源
    cleanup() {
      // 清理页面可见性监听
      if (this.visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      }

      // 清理定时器
      this.clearConnectionTimeout();
      this.clearReconnectTimer();

      // 清理播放器
      if (this.player) {
        this.player.dispose();
        this.player = null;
      }
    }
  }
}
</script>

<style scoped>
/* 组件作用域样式 */
.video-player-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 确保播放器容器有基本尺寸 */
.video-js {
  width: 100% !important;
  height: 100% !important;
  background-color: #000;
}

.video-js .vjs-tech {
  width: 100%;
  height: 100%;
}

/* 加载状态覆盖层 */
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
  z-index: 1000;
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

/* 错误状态覆盖层 */
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
  z-index: 1000;
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

.retry-button:active {
  background-color: #004085;
}

/* 深度选择器修改Video.js默认样式（如果需要） */
::v-deep .vjs-big-play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  border: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

::v-deep .vjs-big-play-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

::v-deep .vjs-has-started .vjs-control-bar {
  height: 40px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

::v-deep .vjs-big-play-button .vjs-icon-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
}

::v-deep .vjs-big-play-button .vjs-icon-placeholder::before {
  font-size: 26px;
  color: #fff;
}

/* 控制栏样式优化 */
::v-deep .vjs-control-bar {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

::v-deep .vjs-control-bar .vjs-button {
  color: #fff;
}

::v-deep .vjs-control-bar .vjs-button:hover {
  color: #007bff;
}

/* 进度条样式 */
::v-deep .vjs-progress-control {
  height: 6px;
}

::v-deep .vjs-progress-holder {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.3);
}

::v-deep .vjs-load-progress {
  background-color: rgba(255, 255, 255, 0.5);
}

::v-deep .vjs-play-progress {
  background-color: #007bff;
}

/* 音量控制样式 */
::v-deep .vjs-volume-panel {
  width: auto;
}

::v-deep .vjs-volume-bar {
  background-color: rgba(255, 255, 255, 0.3);
}

::v-deep .vjs-volume-level {
  background-color: #007bff;
}

/* 全屏按钮样式 */
::v-deep .vjs-fullscreen-control {
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-text {
    font-size: 14px;
  }

  .retry-button {
    padding: 10px 20px;
    font-size: 13px;
  }

  ::v-deep .vjs-big-play-button {
    width: 60px;
    height: 60px;
  }

  ::v-deep .vjs-big-play-button .vjs-icon-placeholder::before {
    font-size: 20px;
  }
}
</style>
