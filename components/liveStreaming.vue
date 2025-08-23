<script lang="ts" setup></script>
<template>
  <div class="index-live">
    <video src="">
      <source src="" type="video/mp4">
      </source>
    </video>
    <div class="live-cont">暫無直播</div>
  </div>
</template>
<style scoped lang="sass">
.index-live
  background: #191919
  height: 70vh
  position: relative
  video
    width: 100%
    height: 100%
  .live-cont
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>
