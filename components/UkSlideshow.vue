<template>
  <div
    class="uk-scope uk-position-relative uk-visible-toggle uk-light"
    tabindex="-1"
    :uk-slideshow="'animation: push;autoplay: true;ratio:' + ratio"
  >
    <ul class="uk-slideshow-items">
      <slot />
    </ul>
    <a
      v-if="slidenav"
      class="uk-position-center-left uk-position-small uk-hidden-hover"
      uk-slidenav-previous
      uk-slideshow-item="previous"
    ></a>
    <a
      v-if="slidenav"
      class="uk-position-center-right uk-position-small uk-hidden-hover"
      uk-slidenav-next
      uk-slideshow-item="next"
    ></a>
    <ul class="uk-slideshow-nav uk-dotnav uk-flex-center uk-margin"></ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  options: {
    type: Object,
    default: {}
  },
  ratio: {
    type: String,
    default: '16:9' // 預設比例
  },
  slidenav: {
    type: Boolean,
    default: false
  }
})

const slideshowRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (process.client) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/assets/uikit/uikit.min.css'
    document.head.appendChild(link)
  }
  await nextTick()
  initSlideshow()
})

const initSlideshow = () => {
  if (!process.client) return

  const UIkit = window.UIkit
  if (!UIkit || !slideshowRef.value) {
    console.error('UIkit not loaded:', !UIkit)
    console.error('DOM not ready:', !slideshowRef.value)
    return
  }

  // 初始化
  UIkit.slideshow(slideshowRef.value, {
    autoplay: true,
    pauseOnHover: false,
    ...props.options
  })
}
// 監聽 ratio 變化
watch(() => props.ratio, initSlideshow)
</script>
<style scoped lang="sass">

.uk-slideshow
  width: 100%
.uk-slideshow-nav
  position: absolute
  bottom: 0
  width: 100%
.uk-dotnav>*>*
  border: 1px solid #fff
  background: #eee
:deep(.uk-dotnav>.uk-active>*)
  background-color: #baa38f !important
  border: 1px solid #fff
</style>
