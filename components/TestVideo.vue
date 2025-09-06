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
    this.player = videojs(this.$refs.videoPlayer, {
      sources: [{
        src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        type: 'application/x-mpegURL'
      }],
      fluid: true,
      controls: true,
      autoplay: false,
      muted: false
    }, () => {
      console.log('测试播放器已准备就绪！');
    });

    this.player.on('error', (e) => {
      console.error('测试播放器错误: ', this.player.error().message);
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>
