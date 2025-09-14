<!-- components/VideoPlayer.vue -->
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

    <section class="chatlayer" ref="section1">
      <div class="chat">
        <div class="goback">
          <div class="back">{{ '主頁' }}</div>
        </div>
        <div class="chat-btm">
          <div class="chat-lis">
            <div class="chat-item" v-for="item in 20">
              <div class="chat-title">
                <div class="title-user">
                  {{ '用戶656516' }}
                </div>
                :
              </div>
              <!-- <div class="chat-item-img">
              <img src="https://picsum.photos/200/300" alt="">
            </div> -->
              <div class="chat-item-text">
                <div class="chat-text" v-if="true">
                  {{ '哈哈哈，早知道' + item }}
                </div>
                <div class="chat-text-img" v-else>
                  <img src="https://picsum.photos/200/300" alt=""></img>
                </div>
              </div>
            </div>

          </div>
          <div class="chat-input">
            <input type="text" maxlength="100" placeholder="請遵守社區秩序"></input>
          </div>
        </div>
      </div>
    </section>
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

    }
  },
  mounted() {
    this.setupPageVisibilityListener();
    this.$nextTick(() => {
      this.initializePlayer();
    });
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
        controls: false, // 隐藏控制栏
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
        this.handleStreamEnd();
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

      // 监听直播断开事件
      this.player.on('disconnect', () => {
        console.log('[VideoPlayer] 直播断开');
        this.handleStreamDisconnect();
      });

      // 监听网络状态变化
      this.player.on('loaderror', () => {
        console.log('[VideoPlayer] 加载错误');
        this.handleError('网络连接失败');
      });

      // 监听播放器状态变化
      this.player.on('emptied', () => {
        console.log('[VideoPlayer] 媒体资源清空');
        this.handleStreamDisconnect();
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

    // 检查网络状态
    checkNetworkStatus() {
      if (navigator.onLine === false) {
        this.handleError('网络连接已断开，请检查网络设置');
        return false;
      }
      return true;
    },

    // 增强的重连机制
    scheduleReconnect() {
      // 检查网络状态
      if (!this.checkNetworkStatus()) {
        return;
      }

      this.reconnectAttempts++;
      const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
      console.log(`[VideoPlayer] 第${this.reconnectAttempts}次重连尝试，${delay / 1000}秒后重试`);

      this.reconnectTimer = setTimeout(() => {
        this.retryConnection();
      }, delay);
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



    // 处理直播结束
    handleStreamEnd() {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = '直播已结束';
      console.log('[VideoPlayer] 直播已结束');

      // 直播结束后不自动重连
      this.clearConnectionTimeout();
      this.clearReconnectTimer();
    },

    // 处理直播断开
    handleStreamDisconnect() {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = '直播连接断开，正在重连...';
      console.log('[VideoPlayer] 直播连接断开');

      // 直播断开时尝试重连
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else {
        this.errorMessage = '直播连接失败，请检查网络或稍后重试';
      }
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
.video-player-container-wrapper {
  /* 模仿抖音/TikTok/YouTube的深色背景风格 */
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  height: 100vh
}

.video-player-container-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all .2s ease;
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

/* 组件作用域样式 */
.video-player-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  overflow: hidden;
  z-index: 2;
  /* 确保在装饰层之上 */
}

/* 竖屏直播模式样式 */
.video-player-container.portrait-mode {
  /* 电脑端竖屏显示 */
  max-width: 400px;
  /* 电脑端最大宽度限制 */
  margin: 0 auto;
  /* 电脑端居中显示 */
  aspect-ratio: 9/16;
  /* 竖屏比例 9:16 */
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

.retry-button:active {
  background-color: #004085;
}

/* 隐藏大播放按钮 */
::v-deep .vjs-big-play-button {
  display: none !important;
}

/* 隐藏控制栏 */
::v-deep .vjs-control-bar {
  display: none !important;
}

/* 隐藏默认加载圈圈 */
::v-deep .vjs-loading-spinner {
  display: none !important;
}

::v-deep .vjs-loading-spinner:before {
  display: none !important;
}

::v-deep .vjs-loading-spinner:after {
  display: none !important;
}

/* 隐藏其他加载相关元素 */
::v-deep .vjs-waiting {
  display: none !important;
}

::v-deep .vjs-seeking {
  display: none !important;
}

::v-deep .vjs-loading {
  display: none !important;
}

/* 自定义声音控制按钮 */
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

/* 响应式设计 - 声音按钮 */
@media (max-width: 768px) {
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

/* 竖屏直播响应式优化 */
@media (max-width: 768px) {
  .video-player-container-wrapper {
    /* 手机端全屏背景 */
    background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    height: 100vh;
  }

  .video-player-container.portrait-mode {
    max-width: 100%;
    /* 手机端占满屏幕宽度 */
    margin: 0;
    /* 手机端取消居中 */
    border-radius: 0;
    /* 手机端取消圆角 */
    height: 100vh;
    /* 手机端占满屏幕高度 */
    aspect-ratio: unset;
    /* 手机端取消固定比例 */
  }
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
<style scoped lang="sass">

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
