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
        <div class="loading-text">正在连接直播...</div>
      </div>
      <!-- 错误状态显示 -->
      <div v-if="hasError" class="error-overlay">
        <div class="error-icon">⚠️</div>
        <div class="error-text">
          {{ errorMessage === '直播连接断开，正在重连...' ? '直播暂停，正在尝试恢复...' : errorMessage }}
        </div>
        <button @click="retryConnection" class="retry-button">手动重连</button>
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
  </div>
</template>

<script setup>
// ------------------------------
// 依赖导入（Vue3/Nuxt3 兼容写法）
// ------------------------------
import { ref, reactive, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs-es6'; // 自动注册flvjs技术
const siteStore = useSiteStore()
// ------------------------------
// 组件属性（保持与 Vue2 兼容）
// ------------------------------
const props = defineProps({
  options: { type: Object, default: () => ({}) },
  playsinline: { type: Boolean, default: true },
  poster: { type: String, default: siteStore.siteData?.logo || '' },
  streamUrl: { type: String, required: true },
  reconnectInterval: { type: Number, default: 5000 },
  maxReconnectAttempts: { type: Number, default: 5 },
  portraitMode: { type: Boolean, default: true }
});

// ------------------------------
// 响应式状态（Vue3 组合式 API）
// ------------------------------
const videoPlayer = ref(null); // 视频元素引用
const player = ref(null); // Video.js 播放器实例
const isLoading = ref(false); // 加载状态
const hasError = ref(false); // 错误状态
const errorMessage = ref(''); // 错误信息
const reconnectAttempts = ref(0); // 当前重连次数
const reconnectTimer = ref(null); // 重连定时器
const isPageVisible = ref(true); // 页面可见性
const connectionTimeout = ref(null); // 连接超时定时器
const isMuted = ref(true); // 是否静音
const isPlayerDestroyed = ref(false); // 播放器是否已销毁

// ------------------------------
// 生命周期钩子（Vue3 替换方案）
// ------------------------------
onMounted(() => {
  setupPageVisibilityListener();
  // 延迟初始化（确保 DOM 就绪）
  setTimeout(initializePlayer, 0);
});

onBeforeUnmount(() => {
  cleanup(); // 组件卸载前清理资源
});

// ------------------------------
// 客户端仅执行（避免 SSR 错误）
// ------------------------------
const isClient = process.client;

// ------------------------------
// 核心方法（播放器初始化、重连等）
// ------------------------------
const initializePlayer = async () => {
  if (!isClient || isPlayerDestroyed.value) return;

  isLoading.value = true;
  hasError.value = false;
  reconnectAttempts.value = 0;

  // 检查视频元素是否存在（SSR 避免服务端报错）
  if (!videoPlayer.value || !document.contains(videoPlayer.value)) {
    handleError('播放器初始化失败：视频元素不存在');
    return;
  }

  // 合并配置（优化 flvjs 配置）
  const defaultOptions = {
    controls: false,
    autoplay: true,
    muted: isMuted.value,
    preload: 'auto',
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: props.options.sources?.length
      ? props.options.sources
      : [{ src: props.streamUrl, type: 'video/flv' }],
    techOrder: ['flvjs'],
    flvjs: {
      enableWorker: true,
      enableStashBuffer: false,
      autoCleanupSourceBuffer: true,
      autoCleanupMaxBackwardDuration: 30,
      autoCleanupMinBackwardDuration: 10,
      stashInitialSize: 1024,
      isLive: true,
      cors: true,
      withCredentials: false,
      onReady: () => {
        console.log('[VideoPlayer] flvjs 技术已就绪');
      }
    }
  };

  // 安全合并配置
  const mergedOptions = {
    ...defaultOptions,
    ...props.options,
    techOrder: props.options.techOrder || defaultOptions.techOrder,
    sources: props.options.sources?.length
      ? props.options.sources
      : defaultOptions.sources,
    flvjs: { ...defaultOptions.flvjs, ...props.options.flvjs }
  };

  try {
    // 初始化播放器（Vue3 需确保 DOM 已挂载）
    player.value = videojs(videoPlayer.value, mergedOptions, () => {
      console.log('[VideoPlayer] 播放器初始化完成');
      player.value.ready(() => {
        setupPlayerEvents(); // 绑定事件
      });
    });
  } catch (error) {
    console.error('[VideoPlayer] 初始化失败:', error);
    handleError('播放器启动失败');
  }
};

const setupPlayerEvents = () => {
  if (!player.value || isPlayerDestroyed.value) return;

  // 延迟检查 flvjs 实例（解决 "flvjs 实例未找到" 警告）
  setTimeout(() => {
    const flvjsInstance = player.value.tech_?.flvjs_;
    if (!flvjsInstance) {
      console.warn('[VideoPlayer] flvjs 实例未找到，无备用方案');
      handleError('播放器初始化失败：flvjs 不可用');
      return;
    }

    // 监听 flv.js 核心错误
    flvjsInstance.on(flvjs.Events.ERROR, (errType, errDetail) => {
      if (isPlayerDestroyed.value) return;
      console.error('[flv.js] 错误:', errType, errDetail);

      if (errType === flvjs.ErrorTypes.NETWORK_ERROR) {
        if (errDetail === flvjs.ErrorDetails.EARLY_EOF) {
          handleError('直播流中断，正在重连...');
          handleStreamDisconnect();
        } else if (errDetail.includes('HTTP2_PROTOCOL_ERROR')) {
          handleError('网络连接异常，正在重连...');
          handleStreamDisconnect();
        }
      }
    });

    // 监听播放器通用错误
    player.value.on('error', (error) => {
      if (isPlayerDestroyed.value) return;
      console.error('[VideoPlayer] 播放器错误:', error);

      if (error.code === 'HTTP2_PROTOCOL_ERROR' || error.details?.includes('HTTP2_PROTOCOL_ERROR')) {
        handleError('网络连接异常，正在重连...');
        handleStreamDisconnect();
      } else if (error.code === 'EARLY_EOF' || error.details?.includes('Early EOF')) {
        handleError('直播流中断，正在重连...');
        handleStreamDisconnect();
      } else {
        handleError(`播放错误: ${error.message || '未知错误'}`);
      }
    });

    // 监听直播断开
    player.value.on('disconnect', () => {
      if (isPlayerDestroyed.value) return;
      console.log('[VideoPlayer] 直播流断开（OBS 暂停/关闭）');
      handleError('直播连接断开，正在重连...');
      handleStreamDisconnect();
    });

    // 监听加载状态
    player.value.on('waiting', () => isLoading.value = true);
    player.value.on('canplay', () => {
      isLoading.value = false;
      hasError.value = false;
    });
    player.value.on('play', () => {
      isLoading.value = false;
      hasError.value = false;
      reconnectAttempts.value = 0; // 播放成功时重置重连次数
    });
  }, 100);
};

const retryConnection = async () => {
  if (!isClient || isPlayerDestroyed.value || !isPageVisible.value) return;

  cleanup(); // 清理旧实例

  try {
    await new Promise(resolve => setTimeout(resolve, 300)); // 延迟重试
    await initializePlayer(); // 重新初始化
  } catch (error) {
    console.error('[VideoPlayer] 重连初始化失败:', error);
    if (reconnectAttempts.value < props.maxReconnectAttempts) {
      scheduleReconnect();
    }
  }
};

const handleStreamDisconnect = () => {
  isLoading.value = false;
  hasError.value = true;
  errorMessage.value = '直播连接断开，正在重连...';

  if (player.value) {
    cleanup(); // 销毁旧实例
    player.value = null;
  }

  scheduleReconnect();
};

const scheduleReconnect = () => {
  if (reconnectAttempts.value >= props.maxReconnectAttempts || isPlayerDestroyed.value) {
    errorMessage.value = '直播连接失败，请检查网络或稍后重试';
    hasError.value = true;
    isLoading.value = false;
    return;
  }

  reconnectAttempts.value++;
  const baseDelay = reconnectAttempts.value <= 3 ? 2000 : 5000;
  const delay = Math.min(baseDelay * Math.pow(1.5, reconnectAttempts.value - 1), 30000);

  console.log(`[VideoPlayer] 第${reconnectAttempts.value}次重连，${delay / 1000}秒后尝试`);
  reconnectTimer.value = setTimeout(() => {
    retryConnection();
  }, delay);
};

const cleanup = () => {
  if (player.value) {
    // 清理 flvjs 实例（若存在）
    const flvjsInstance = player.value.tech_?.flvjs_;
    if (flvjsInstance) {
      flvjsInstance.destroy();
      player.value.tech_.flvjs_ = null;
    }

    // 移除事件监听
    const events = [
      'play', 'pause', 'ended', 'loadstart', 'canplay',
      'waiting', 'stalled', 'timeout', 'disconnect',
      'loaderror', 'emptied', 'error'
    ];
    events.forEach(event => player.value.off(event));

    player.value.dispose(); // 销毁播放器
    player.value = null;
  }

  // 清理定时器
  clearTimeout(connectionTimeout.value);
  clearTimeout(reconnectTimer.value);
  connectionTimeout.value = null;
  reconnectTimer.value = null;

  // 标记状态
  isPlayerDestroyed.value = true;
  reconnectAttempts.value = 0;
};

const handleError = (message) => {
  isLoading.value = false;
  hasError.value = true;
  errorMessage.value = message;

  if (reconnectAttempts.value < props.maxReconnectAttempts && !isPlayerDestroyed.value) {
    scheduleReconnect();
  }
};

// ------------------------------
// 辅助方法（页面可见性、静音切换等）
// ------------------------------
const setupPageVisibilityListener = () => {
  if (!isClient) return;

  const handleVisibilityChange = () => {
    isPageVisible.value = !document.hidden;

    if (isPageVisible.value && player.value && !isPlayerDestroyed.value) {
      console.log('[VideoPlayer] 页面变为可见，恢复播放');
      player.value.play().catch(err => {
        console.log('[VideoPlayer] 自动播放失败（需要用户交互）:', err);
      });
    } else if (!isPageVisible.value && player.value && !isPlayerDestroyed.value) {
      console.log('[VideoPlayer] 页面变为隐藏，暂停播放');
      player.value.pause();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  // 存储监听器以便清理（Nuxt3 需手动管理）
  const instance = getCurrentInstance();
  if (instance) {
    instance.appContext.config.globalProperties.$visibilityHandler = handleVisibilityChange;
  }
};

const toggleMute = () => {
  if (player.value && !isPlayerDestroyed.value) {
    isMuted.value = !isMuted.value;
    player.value.muted(isMuted.value);
  }
};

const navigateTo = (path) => {
  // Nuxt3 路由跳转（需安装 @nuxtjs/router）
  import('vue-router').then(({ useRouter }) => {
    useRouter().push(path);
  });
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
