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
        <div class="loading-text">正在连接直播...</div>
      </div>
      <!-- 错误状态显示 -->
      <div v-if="hasError" class="error-overlay">
        <div class="error-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
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
// 导入Vue 3和Nuxt相关API
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

// 1. 引入video.js和flvjs插件
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs-es6'; // 自动注册flvjs技术

// 定义props
const props = defineProps({
  options: { type: Object, default: () => ({}) },
  playsinline: { type: Boolean, default: true },
  poster: { type: String, default: '' },
  streamUrl: { type: String, required: true },
  reconnectInterval: { type: Number, default: 5000 },
  maxReconnectAttempts: { type: Number, default: 99 },
  portraitMode: { type: Boolean, default: true }
});

const videoOptions = {
  sources: [{
    src: 'https://synaptiqh.com/live/livestream.flv',
    type: 'video/flv' // 类型必须正确
  }],
  autoplay: true,   // 是否自动播放
  muted: true,      // 自动播放时必须为true
  techOrder: ['flvjs'] // 明确指定使用flvjs技术
}



// 使用Vue Router
const router = useRouter();

// 响应式数据
const videoPlayer = ref(null);
const player = ref(null);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const reconnectAttempts = ref(0);
const reconnectTimer = ref(null);
const isPageVisible = ref(true);
const connectionTimeout = ref(null);
const isMuted = ref(true);
const flvjsReady = ref(false);
const visibilityChangeHandler = ref(null);
// 添加 heartbeatTimer 到顶层作用域
const heartbeatTimer = ref(null);

// 监听props变化
watch(() => props.streamUrl, (newUrl) => {
  if (newUrl && player.value) {
    retryConnection();
  }
});

// 生命周期钩子
onMounted(() => {
  reconnectAttempts.value = 0;
  setupPageVisibilityListener();
  nextTick(() => initializePlayer());
});

onBeforeUnmount(() => {
  isComponentActive = false; // 设置组件为非活跃状态
  cleanup();
  if (visibilityChangeHandler.value) {
    document.removeEventListener('visibilitychange', visibilityChangeHandler.value);
  }
});

// 方法定义
const navigateTo = (path) => {
  router.push(path);
};
const nativePlayer = {}
const clearConnectionTimeout = () => {
  if (connectionTimeout.value) {
    clearTimeout(connectionTimeout.value);
    connectionTimeout.value = null;
  }
};
// 新增：处理 Early-EOF 的紧急重连
const handleEarlyEofReconnect = () => {
  console.log('[VideoPlayer] 执行 Early-EOF 紧急重连');
  clearTimers(); // 清除所有定时器
  cleanup(); // 销毁当前播放器实例
  reconnectAttempts.value = 0; // 重置重连计数器（可选）
  initializePlayer(); // 立即重新初始化播放器
};

// 将变量声明改为函数声明，避免重新赋值
let isComponentActive = true; // 添加组件活跃状态标志

// 修改为 let 声明以允许重新赋值
let setupPlayerEvents = null;

function initializePlayer() {
  // 检查组件是否仍然活跃
  if (!isComponentActive) {
    console.log('[VideoPlayer] 组件已不活跃，取消初始化');
    clearTimeout(heartbeatTimer);
    return;
  }

  nextTick(() => {
    isLoading.value = true;
    hasError.value = false;
  });

  // 检查视频元素是否存在，改进检查逻辑
  if (!videoPlayer.value) {
    console.warn('[VideoPlayer] 播放器初始化失败：视频元素引用为空');
    // 延迟重试，给DOM更新时间
    setTimeout(() => {
      if (videoPlayer.value) {
        initializePlayer();
      } else {
        handleError('播放器初始化失败：视频元素不存在');
      }
    }, 100);
    return;
  }

  // 确保视频元素在DOM中
  if (!document.contains(videoPlayer.value)) {
    console.warn('[VideoPlayer] 播放器初始化失败：视频元素不在DOM中');
    handleError('播放器初始化失败：视频元素未正确挂载');
    return;
  }

  // 合并配置
  const defaultOptions = {
    controls: false,
    autoplay: true,
    muted: isMuted.value,
    preload: 'auto',
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: videoOptions.sources?.length
      ? videoOptions.sources
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
        console.log('[VideoPlayer] flvjs技术已就绪');
        flvjsReady.value = true;
      }
    }
  };

  // 安全合并配置
  // 修改 initializePlayer 中的 mergedOptions，强制使用 HTTP/1.1
  const mergedOptions = {
    ...defaultOptions,
    ...videoOptions,
    techOrder: videoOptions.techOrder || defaultOptions.techOrder,
    sources: videoOptions.sources?.length ? videoOptions.sources : defaultOptions.sources,
    flvjs: { ...defaultOptions.flvjs, ...videoOptions.flvjs },
    httpHeaders: {
      'Connection': 'keep-alive', // 强制长连接
      'Upgrade': 'TLS/1.2, HTTP/1.1' // 显式降级到 HTTP/1.1
    }
  };

  try {
    // 添加检查确保组件仍然挂载
    if (!videoPlayer.value) {
      console.log('[VideoPlayer] 组件已卸载，取消初始化');
      return;
    }

    // 在创建新实例前确保旧实例已完全销毁
    if (player.value) {
      console.log('[VideoPlayer] 销毁现有播放器实例');
      cleanup();
    }

    console.log('[VideoPlayer] 创建新的播放器实例');
    player.value = videojs(videoPlayer.value, mergedOptions, () => {
      console.log('[VideoPlayer] 播放器初始化完成');
      // 等待 ready 事件，并检查原生实例是否完全初始化
      console.log(player.value);

      // 添加检查确保组件仍然挂载
      if (!player.value) {
        console.log('[VideoPlayer] 播放器已被销毁，取消初始化回调');
        return;
      }

      player.value.ready(() => {
        // 再次检查组件是否仍然挂载
        if (player.value) {
          // 重新创建事件设置函数
          setupPlayerEvents = function () {
            // 安全获取原生播放器实例
            const nativePlayer = player.value ? (player.value.tech_ || player.value._Player) : null;

            // 检查播放器实例是否存在
            if (!nativePlayer) {
              console.warn('[VideoPlayer] 无法获取原生播放器实例');
              return;
            }

            // ------------------------------
            // 1. 定义心跳检测相关变量（模块化）
            // ------------------------------
            let lastDataTime = Date.now(); // 记录最后一次数据更新时间（初始为当前时间）
            let heartbeatTimer = null; // 心跳定时器
            let isComponentActive = true; // 组件活动状态标志

            // 在组件销毁时设置标志 - 修改为不重新赋值cleanup函数
            const updateCleanup = () => {
              isComponentActive = false;
              if (heartbeatTimer) {
                clearInterval(heartbeatTimer);
                heartbeatTimer = null;
              }
            };

            // 修改cleanup函数，添加对心跳检测的清理
            const originalCleanup = cleanup;
            const modifiedCleanup = () => {
              updateCleanup();
              originalCleanup();
            };

            // ------------------------------
            // 2. 心跳检测核心逻辑（独立函数）
            // ------------------------------
            const startHeartbeatCheck = () => {
              // 清除旧定时器（避免重复触发）
              if (heartbeatTimer) clearInterval(heartbeatTimer);

              // 启动新定时器（每3秒检查一次）
              heartbeatTimer = setInterval(() => {
                // 检查组件是否仍然活动
                if (!isComponentActive) {
                  clearInterval(heartbeatTimer);
                  return;
                }

                try {
                  // 若超过5秒无数据更新，判定为流中断
                  if (Date.now() - lastDataTime > 5000) {
                    console.log('[VideoPlayer] 心跳检测：流已中断（OBS停播）');
                    if (isComponentActive) {
                      handleStreamDisconnect(); // 触发重连
                    }
                  }
                } catch (heartbeatError) {
                  console.error('[VideoPlayer] 心跳检测失败:', heartbeatError);
                }
              }, 3000);
            };

            // ------------------------------
            // 3. 获取 flv.js 实例的正确方法
            // ------------------------------
            const getFlvInstance = () => {
              try {
                // 检查组件是否仍然活动
                if (!isComponentActive) return null;

                // 使用 video.js 的 tech() 方法获取技术实例
                if (player.value && typeof player.value.tech === 'function') {
                  const tech = player.value.tech({ IWillNotUseThisInPlugins: true });
                  // 从技术实例中获取 flv.js 实例
                  if (tech && typeof tech.flvjs === 'object') {
                    return tech.flvjs;
                  }
                  // 如果通过tech()方法没有获取到，尝试通过tech_属性获取
                  if (tech && tech.tech_ && typeof tech.tech_.flvjs === 'object') {
                    return tech.tech_.flvjs;
                  }
                }
                // 备用方案：直接从player.tech_获取
                if (player.value && player.value.tech_ && typeof player.value.tech_.flvjs === 'object') {
                  return player.value.tech_.flvjs;
                }
                return null;
              } catch (e) {
                console.warn('[VideoPlayer] 获取 flv.js 实例失败:', e);
                return null;
              }
            };

            // ------------------------------
            // 4. 监听 video.js 核心事件（含时间更新）
            // ------------------------------
            const handleVideoError = (error) => {
              // 检查组件是否仍然活动
              if (!isComponentActive) return;

              console.error('[VideoPlayer] 播放器错误:', error);
              if (error) {
                const isStreamError = error.message?.includes('Early-EOF') ||
                  error.message?.includes('HTTP2_PROTOCOL_ERROR') ||
                  error.message?.includes('UnrecoverableEarlyEof');
                isStreamError ? handleStreamDisconnect() : handleError('播放错误', error);
              }
            };

            // ------------------------------
            // 5. 监听直播状态事件（含播放/暂停/结束）
            // ------------------------------
            const handleLiveStateChange = () => {
              // 直播断开（OBS暂停/关闭）
              nativePlayer.on('disconnect', () => {
                // 检查组件是否仍然活动
                if (!isComponentActive) return;

                console.log('[VideoPlayer] 直播流断开（OBS暂停/关闭）');
                handleError('直播连接断开，正在重连...');
                handleStreamDisconnect();
              });

              // 加载状态
              nativePlayer.on('waiting', () => {
                if (isComponentActive) isLoading.value = true;
              });
              nativePlayer.on('canplay', () => {
                if (isComponentActive) {
                  isLoading.value = false;
                  hasError.value = false;
                }
              });

              // 播放状态（关键：播放时更新数据时间）
              nativePlayer.on('play', () => {
                if (!isComponentActive) return;

                isLoading.value = false;
                hasError.value = false;
                reconnectAttempts.value = 0;
                lastDataTime = Date.now(); // 播放开始时重置数据时间
                startHeartbeatCheck(); // 播放时启动心跳检测
              });

              // 时间更新事件（关键：播放过程中持续更新数据时间）
              nativePlayer.on('timeupdate', () => {
                if (isComponentActive) {
                  lastDataTime = Date.now(); // 每次时间更新时记录当前时间
                }
              });
            };

            // ------------------------------
            // 6. 绑定所有事件（确保播放器准备好后执行）
            // ------------------------------
            player.value.ready(() => {
              // 检查组件是否仍然活动
              if (!isComponentActive || !player.value) return;

              // 延迟一小段时间确保技术完全初始化
              setTimeout(() => {
                // 检查组件是否仍然活动
                if (!isComponentActive || !player.value) return;

                // 绑定 flv.js 错误监听
                const flvInstance = getFlvInstance();
                if (flvInstance) {
                  flvInstance.on('error', (errType, errDetail) => {
                    // 检查组件是否仍然活动
                    if (!isComponentActive) return;

                    console.error('[flv.js] 内部错误:', errType, errDetail);
                    if (errDetail && errDetail.code === 1001) { // EARLY_EOF code
                      console.log('[VideoPlayer] 检测到 Early-EOF，触发紧急重连');
                      handleEarlyEofReconnect();
                    }
                  });
                } else {
                  console.warn('[VideoPlayer] 未获取到 flv.js 实例，可能技术未注册或初始化未完成');
                }

                // 绑定 video.js 核心错误监听
                player.value.on('error', handleVideoError);

                // 绑定直播状态监听（含播放时的心跳启动）
                handleLiveStateChange();
              }, 300); // 增加延迟到300毫秒确保技术完全初始化

              // 绑定通用事件（暂停/结束/加载等）
              const handleCommonEvents = {
                pause: () => {
                  // 检查组件是否仍然活动
                  if (!isComponentActive) return;

                  console.log('[VideoPlayer] 播放暂停');
                  clearInterval(heartbeatTimer); // 暂停时停止心跳检测
                },
                ended: () => {
                  if (isComponentActive) handleStreamEnd();
                },
                loadstart: () => {
                  if (isComponentActive) {
                    isLoading.value = true;
                    clearConnectionTimeout();
                  }
                },
                stalled: () => {
                  if (isComponentActive) handleError('数据加载停滞');
                },
                timeout: () => {
                  if (isComponentActive) handleError('连接超时');
                },
                loaderror: () => {
                  if (isComponentActive) handleError('网络连接失败');
                },
                emptied: () => {
                  if (isComponentActive) handleStreamDisconnect();
                }
              };
              Object.entries(handleCommonEvents).forEach(([event, handler]) => {
                player.value.on(event, handler);
              });
            });
          };

          setupPlayerEvents(); // 原生实例准备好后绑定事件
        }
      });
    });
  } catch (initError) {
    console.error('[VideoPlayer] 初始化失败:', initError);
    handleError('播放器启动失败', initError);
  }
};

const retryConnection = () => {
  // 检查组件是否仍然活跃
  if (!isComponentActive) {
    console.log('[VideoPlayer] 组件已不活跃，取消重连');
    return;
  }

  if (!isPageVisible.value) {
    console.log('[VideoPlayer] 页面不可见，跳过重连');
    return;
  }

  clearTimers();

  // 确保旧播放器实例完全销毁
  if (player.value) {
    cleanup();
    player.value = null;
  }

  // 延迟初始化
  setTimeout(() => {
    // 在初始化前再次检查组件状态和页面可见性
    if (!isComponentActive) {
      console.log('[VideoPlayer] 组件已不活跃，取消重连');
      return;
    }

    if (!isPageVisible.value) {
      console.log('[VideoPlayer] 页面不可见，取消重连');
      return;
    }

    console.log('[VideoPlayer] 尝试重连...');
    initializePlayer();
  }, 500); // 增加延迟到500毫秒确保清理完成
};

const cleanup = () => {
  if (player.value) {
    // 移除所有事件监听
    const events = [
      'play', 'pause', 'ended', 'loadstart', 'canplay',
      'waiting', 'stalled', 'timeout', 'disconnect',
      'loaderror', 'emptied', 'error', 'ready'
    ];
    events.forEach(event => player.value.off(event));

    // 销毁播放器实例（释放资源）
    player.value.dispose();
    player.value = null; // 关键：置空实例，避免后续调用
  }

  // 清理定时器
  clearTimers();
  // 重置状态
  isLoading.value = false;
  flvjsReady.value = false;
  hasError.value = false;
};

const clearTimers = () => {
  clearTimeout(connectionTimeout.value);
  clearTimeout(reconnectTimer.value);
  connectionTimeout.value = null;
  reconnectTimer.value = null;

  // 清理心跳定时器
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

const handleError = (message, error = null) => {
  isLoading.value = false;
  hasError.value = true;
  errorMessage.value = message;
  console.warn('[VideoPlayer] 错误:', error, message);
  if (error) {
    console.error('[VideoPlayer] 错误详情:', error);

    // 检测特定错误类型
    if (error.message && (
      error.message.includes('Early-EOF') ||
      error.message.includes('HTTP2_PROTOCOL_ERROR') ||
      error.message.includes('UnrecoverableEarlyEof')
    )) {
      console.log('[VideoPlayer] 检测到OBS断开错误，触发重连');
      // 立即清理并重连
      if (player.value) {
        cleanup();
        player.value = null;
      }
      scheduleReconnect();
      return;
    }
  }

  // 触发重连（未超过最大次数时）
  if (reconnectAttempts.value < props.maxReconnectAttempts) {
    scheduleReconnect();
  } else {
    // 达到最大重连次数时，清理心跳定时器
    clearTimers();
  }
};

const scheduleReconnect = () => {
  if (reconnectAttempts.value >= props.maxReconnectAttempts) {
    errorMessage.value = '直播连接失败，请检查网络或稍后重试';
    hasError.value = true;
    isLoading.value = false;
    console.log('[VideoPlayer] 重连失败，已达最大次数');
    // 清理心跳定时器
    clearTimers();
    return;
  }

  reconnectAttempts.value++;
  let baseDelay;

  // 判断是否为流中断错误（根据错误信息或标志位）
  const isStreamInterruption = errorMessage.value?.includes('Early-EOF') ||
    errorMessage.value?.includes('直播连接断开');

  if (isStreamInterruption) {
    // 流中断时快速重连（前3次1秒，之后3秒）
    baseDelay = reconnectAttempts.value <= 3 ? 1000 : 3000;
  } else {
    // 其他错误使用指数退避（避免频繁请求）
    baseDelay = 3000 * Math.pow(2, Math.min(reconnectAttempts.value - 1, 2)); // 前3次指数增长
  }

  const actualDelay = Math.min(baseDelay, 10000); // 最大间隔不超过10秒
  console.log(`[VideoPlayer] 第${reconnectAttempts.value}次重连，${actualDelay / 1000}秒后尝试`);
  reconnectTimer.value = setTimeout(() => initializePlayer(), actualDelay);
};

const setupPageVisibilityListener = () => {
  const handleVisibilityChange = () => {
    isPageVisible.value = !document.hidden;

    if (isPageVisible.value) {
      console.log('[VideoPlayer] 页面变为可见，恢复播放');
      // 页面可见时重新连接直播
      retryConnection();
    } else {
      console.log('[VideoPlayer] 页面变为隐藏，断开直播');
      // 页面隐藏时断开直播
      if (player.value) {
        cleanup();
        player.value = null;
      }
      clearTimers();
      isLoading.value = false;
      hasError.value = false;
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  visibilityChangeHandler.value = handleVisibilityChange;
};

const toggleMute = () => {
  if (player.value) {
    isMuted.value = !isMuted.value;
    player.value.muted(isMuted.value);
  }
};

const handleStreamEnd = () => {
  isLoading.value = false;
  hasError.value = true;
  errorMessage.value = '直播已结束';
  clearTimers();
};

const handleStreamDisconnect = () => {
  isLoading.value = false;
  hasError.value = true;
  errorMessage.value = '直播连接断开，正在重连...';

  if (player.value) {
    cleanup();
    player.value = null;
  }

  scheduleReconnect();
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
  color: #ffcc00aa;
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
        background: rgba(0, 0, 0, .32)
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
        padding: 10px 20px
        color: #fff
</style>
