<template>
  <div>
    <h3>Video.js 测试组件</h3>
    <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered" controls playsinline preload="auto"
      width="640" height="360"></video>
  </div>
</template>

<script>
// 1. 直接引入，避免任何插件配置问题
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default {
  name: 'TestVideo',
  mounted() {
    // 2. 使用一个绝对可靠的公共测试流（HLS）
    // 在mounted或适当的生命周期钩子中
    this.player = videojs(this.$refs.videoPlayer, {
      sources: [{
        src: 'http://synaptiqh.com:8080/live/livestream.flv',
        type: 'video/x-flv'
      }],
      fluid: true,
      controls: true,
      autoplay: false,
      muted: false,
      liveui: true,
      flvjs: {
        mediaDataSource: {
          isLive: true
        }
      }
    });

    this.player.ready(() => {
      console.log('FLV直播播放器已准备就绪！');
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>
