import Vue from 'vue'
// 引入video.js的CSS文件
import 'video.js/dist/video-js.css'

// 如果是Nuxt项目，可能需要使用require和ssr配置
let VideoPlayer

if (process.client) { // 确保只在客户端执行
  VideoPlayer = require('video.js').default
  // 如果需要，这里可以注册插件，例如用于HLS播放的videojs-contrib-hls
  // require('videojs-contrib-hls')
}

// 你也可以选择以Vue插件的形式全局引入，但通常更推荐在组件内直接引入
// Vue.prototype.$video = VideoPlayer
