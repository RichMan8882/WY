<template>
  <div>
    <h3>Video.js FLV直播测试</h3>
    <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered" controls playsinline
      preload="auto"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default {
  name: 'TestVideo',
  mounted() {
    // 动态加载CDN资源
    this.loadFLVJS();
  },
  methods: {
    loadFLVJS() {
      // 检查是否已加载
      if (window.videojsFlvjs) {
        this.initPlayer();
        return;
      }

      // 加载CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/videojs-flvjs-es6/dist/videojs-flvjs.css';
      document.head.appendChild(cssLink);

      // 加载JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/videojs-flvjs-es6/dist/videojs-flvjs.js';
      script.onload = () => {
        window.videojsFlvjs = true;
        this.initPlayer();
      };
      document.body.appendChild(script);
    },
    initPlayer() {
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
            isLive: true,
            cors: true,
            withCredentials: false
          }
        }
      });

      this.player.ready(() => {
        console.log('FLV直播播放器已准备就绪！');
      });

      this.player.on('error', (e) => {
        console.error('播放错误:', e);
      });
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>
