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
        <div class="error-text">
          {{ errorMessage === '直播连接断开，正在重连...' ? '直播暂停，正在尝试恢复...' : errorMessage }}
        </div>
        <button @click="retryConnection" class="retry-button">手动重连</button>
      </div>
    </div>

    <section class="chatlayer" ref="section1">
      <div class="chat">
        <div class="goback">
          <div class="back" @click="navigateTo('/')">{{ '主頁' }}</div>
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
// 1. 引入video.js和flvjs插件（确保flvjs技术正确注册）
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs-es6'; // 自动注册flvjs技术

export default {
  name: 'VideoPlayer',
  props: {
    options: { type: Object, default: () => ({}) },       // 父组件自定义配置
    playsinline: { type: Boolean, default: true },         // iOS内联播放
    poster: { type: String, default: '' },                 // 封面图
    streamUrl: { type: String, required: true },           // 直播流地址（必传）
    reconnectInterval: { type: Number, default: 5000 },    // 重连基础间隔（ms）
    maxReconnectAttempts: { type: Number, default: 5 },    // 最大重连次数
    portraitMode: { type: Boolean, default: true }         // 竖屏模式
  },
  data() {
    return {
      player: null,                  // Video.js播放器实例
      isLoading: false,              // 加载状态
      hasError: false,               // 错误状态
      errorMessage: '',              // 错误信息
      reconnectAttempts: 0,          // 当前重连次数
      reconnectTimer: null,          // 重连定时器
      isPageVisible: true,           // 页面可见性
      connectionTimeout: null,       // 连接超时定时器
      isMuted: true                  // 是否静音（自动播放必须）
    };
  },
  mounted() {
    this.setupPageVisibilityListener(); // 监听页面可见性
    this.$nextTick(() => this.initializePlayer()); // DOM就绪后初始化播放器
  },
  beforeDestroy() {
    this.cleanup(); // 组件销毁前清理资源
  },
  watch: {
    // 监听直播流地址变化，自动重连
    streamUrl(newUrl) {
      newUrl && this.player && this.retryConnection();
    }
  },
  methods: {
    /**
     * 初始化播放器（核心方法）
     */
    initializePlayer() {
      this.isLoading = true;
      this.hasError = false;

      // 检查视频元素是否存在（修复"元素未在DOM中"警告）
      const videoEl = this.$refs.videoPlayer;
      if (!videoEl || !document.contains(videoEl)) {
        this.handleError('播放器初始化失败：视频元素不存在');
        return;
      }

      // 合并配置（避免修改默认配置，解决mergeOptions警告）
      const defaultOptions = {
        controls: false,          // 隐藏控制栏
        autoplay: true,           // 自动播放
        muted: this.isMuted,      // 静音（自动播放必须）
        preload: 'auto',          // 预加载
        fluid: true,              // 自适应布局
        playbackRates: [0.5, 1, 1.5, 2], // 播放速度选项
        sources: this.options.sources?.length
          ? this.options.sources       // 父组件传入的视频源
          : [{ src: this.streamUrl, type: 'video/flv' }], // 默认FLV流
        techOrder: ['flvjs', 'html5'], // 优先使用flvjs技术
        flvjs: {
          enableWorker: true,       // 启用Worker提升性能
          enableStashBuffer: false,  // 禁用临时缓冲（减少延迟）
          autoCleanupSourceBuffer: true, // 自动清理旧缓冲区
          autoCleanupMaxBackwardDuration: 30, // 最大保留30秒旧数据
          autoCleanupMinBackwardDuration: 10, // 最小保留10秒旧数据
          stashInitialSize: 1024,    // 初始缓冲区大小（1KB）
          isLive: true,              // 标记为直播流
          cors: true,                // 允许跨域
          withCredentials: false,    // 不携带Cookie
          onError: (errType, errDetail) => { // flv.js内部错误监听
            console.error('[flv.js] 内部错误:', errType, errDetail);
            this.handleStreamDisconnect(); // 触发重连
          }
        }
      };

      // 安全合并父组件配置（避免覆盖技术相关参数）
      const mergedOptions = {
        ...defaultOptions,
        ...this.options,
        techOrder: this.options.techOrder || defaultOptions.techOrder, // 保留父组件技术顺序
        sources: this.options.sources?.length
          ? this.options.sources
          : defaultOptions.sources, // 保留父组件视频源
        flvjs: { ...defaultOptions.flvjs, ...this.options.flvjs } // 合并flvjs配置
      };

      try {
        // 初始化Video.js播放器（添加ready回调确保实例就绪）
        this.player = videojs(videoEl, mergedOptions, () => {
          console.log('[VideoPlayer] 播放器初始化完成');
          this.setupPlayerEvents(); // 播放器就绪后绑定事件
        });
      } catch (error) {
        console.error('[VideoPlayer] 初始化失败:', error);
        this.handleError('播放器启动失败');
      }
    },

    /**
     * 绑定播放器事件（优化版）
     */
    setupPlayerEvents() {
      if (!this.player) return;

      // 延迟检查flvjs实例（解决"flvjs实例未找到"警告）
      setTimeout(() => {
        const flvjsInstance = this.player.tech_?.flvjs_;
        if (!flvjsInstance) {
          console.warn('[VideoPlayer] flvjs实例未找到，启用HTML5备用方案');
          this.handleFallbackToHtml5(); // 切换HTML5技术
          return;
        }

        // 绑定flv.js专属事件（处理Early EOF等错误）
        flvjsInstance.on(flvjs.Events.ERROR, (errType, errDetail) => {
          if (errType === flvjs.ErrorTypes.NETWORK_ERROR
            && errDetail === flvjs.ErrorDetails.EARLY_EOF) {
            console.log('[VideoPlayer] 检测到流中断（Early EOF）');
            this.handleStreamDisconnect(); // 触发重连
          }
        });
      }, 100);

      // 通用事件监听（统一管理）
      const eventHandlers = {
        // 播放事件：隐藏加载状态，重置重连次数
        play: () => {
          this.isLoading = false;
          this.hasError = false;
          this.reconnectAttempts = 0;
          this.clearConnectionTimeout();
        },
        // 暂停事件（如OBS暂停）
        pause: () => console.log('[VideoPlayer] 播放暂停'),
        // 播放结束（直播流正常结束）
        ended: () => this.handleStreamEnd(),
        // 开始加载：显示加载状态
        loadstart: () => {
          this.isLoading = true;
          this.clearConnectionTimeout();
        },
        // 可以播放：隐藏加载状态
        canplay: () => {
          this.isLoading = false;
          this.hasError = false;
        },
        // 等待数据：显示加载状态
        waiting: () => this.isLoading = true,
        // 数据停滞：提示加载问题
        stalled: () => this.handleError('数据加载停滞'),
        // 连接超时：提示超时
        timeout: () => this.handleError('连接超时'),
        // 直播断开（如OBS关闭推流）
        disconnect: () => this.handleStreamDisconnect(),
        // 网络加载错误
        loaderror: () => this.handleError('网络连接失败'),
        // 媒体资源清空（直播流重置）
        emptied: () => this.handleStreamDisconnect(),
        // 统一错误处理（捕获所有未处理的错误）
        error: (e) => this.handlePlayerError(e)
      };

      // 批量绑定事件（避免遗漏）
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        this.player.on(event, handler);
      });
    },

    /**
     * 统一处理播放器错误（关键修复点）
     */
    handlePlayerError(error) {
      const code = error?.code;
      const details = error?.details;
      let msg = '播放异常，请稍后重试';

      // 识别HTTP2协议错误
      if (code === 'HTTP2_PROTOCOL_ERROR' || details?.includes('HTTP2')) {
        msg = '网络不稳定，正在重连...';
      }
      // 识别Early EOF错误（流提前终止）
      else if (code === 'EARLY_EOF' || details?.includes('Early EOF')) {
        msg = '直播流中断，正在重连...';
      }
      // 其他错误（如404、500等）
      else if (details?.includes('404') || details?.includes('500')) {
        msg = `资源加载失败（${details}），正在重连...`;
      }

      this.handleError(msg, error);
    },

    /**
     * 处理重连逻辑（优化版）
     */
    retryConnection() {
      if (!this.isPageVisible) {
        console.log('[VideoPlayer] 页面不可见，跳过重连');
        return;
      }

      this.clearTimers(); // 清理所有定时器

      // 确保旧播放器实例完全销毁
      if (this.player) {
        this.cleanup();
        this.player = null;
      }

      // 延迟初始化（避免DOM未就绪或网络波动）
      setTimeout(() => {
        console.log('[VideoPlayer] 尝试重连...');
        this.initializePlayer();
      }, 300);
    },

    /**
     * 清理资源（关键修复点）
     */
    cleanup() {
      // 清理页面可见性监听
      if (this.visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
        this.visibilityChangeHandler = null;
      }

      // 清理定时器
      this.clearTimers();

      // 移除播放器事件监听（避免内存泄漏）
      if (this.player) {
        const events = [
          'play', 'pause', 'ended', 'loadstart', 'canplay',
          'waiting', 'stalled', 'timeout', 'disconnect',
          'loaderror', 'emptied', 'error'
        ];
        events.forEach(event => this.player.off(event)); // 移除所有事件监听

        this.player.dispose(); // 销毁播放器实例
        this.player = null;
      }
    },

    /**
     * 清理所有定时器
     */
    clearTimers() {
      clearTimeout(this.connectionTimeout);
      clearTimeout(this.reconnectTimer);
      this.connectionTimeout = null;
      this.reconnectTimer = null;
    },

    /**
     * 处理错误状态（关键修复点：确保遮罩关闭）
     */
    handleError(message, error = null) {
      this.isLoading = false; // 关键：强制关闭加载状态
      this.hasError = true;
      this.errorMessage = message;

      // 触发重连（未超过最大次数时）
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    },

    /**
     * 安排重连（指数退避算法）
     */
    scheduleReconnect() {
      this.reconnectAttempts++;
      const baseDelay = this.reconnectAttempts <= 3 ? 1000 : 2000; // 前3次1秒，之后2秒
      const delay = Math.min(baseDelay * Math.pow(1.5, this.reconnectAttempts - 1), 30000); // 最大30秒

      console.log(`[VideoPlayer] 第${this.reconnectAttempts}次重连，${delay / 1000}秒后尝试`);
      this.reconnectTimer = setTimeout(() => this.retryConnection(), delay);
    },

    /**
     * 切换为HTML5技术播放（备用方案）
     */
    handleFallbackToHtml5() {
      console.log('[VideoPlayer] 切换为HTML5技术播放');
      this.options.techOrder = ['html5']; // 强制使用HTML5
      this.retryConnection(); // 重新初始化
    },

    /**
     * 监听页面可见性变化（优化性能）
     */
    setupPageVisibilityListener() {
      const handleVisibilityChange = () => {
        this.isPageVisible = !document.hidden;

        if (this.isPageVisible) {
          console.log('[VideoPlayer] 页面变为可见，恢复播放');
          this.player?.play().catch(err => {
            console.log('[VideoPlayer] 自动播放失败（需要用户交互）:', err);
          });
        } else {
          console.log('[VideoPlayer] 页面变为隐藏，暂停播放');
          this.player?.pause();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      this.visibilityChangeHandler = handleVisibilityChange; // 存储监听器以便清理
    },

    /**
     * 切换静音状态
     */
    toggleMute() {
      if (this.player) {
        this.isMuted = !this.isMuted;
        this.player.muted(this.isMuted);
      }
    },

    /**
     * 处理直播结束（非重连场景）
     */
    handleStreamEnd() {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = '直播已结束';
      this.clearTimers(); // 清理重连定时器
    },

    /**
     * 处理直播断开（触发重连）
     */
    handleStreamDisconnect() {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = '直播连接断开，正在重连...';
      this.scheduleReconnect(); // 立即触发重连
    }
  }
};
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
  z-index: 51;
}

.sound-button {
  color: rgba(0, 0, 0, 0.6);
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
  color: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.sound-button.muted .sound-icon {
  color: rgba(255, 0, 0, 0.6);
}

.sound-button.muted:hover .sound-icon {
  color: rgba(255, 0, 0, 0.8);
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
  z-index: 49
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
          max-width: 35%
          min-width: 70px
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
