<script lang="ts" setup></script>

<template>
  <div class="page">
    <client-only><router-view></router-view></client-only>
  </div>
</template>
<style scoped lang="sass">
.page
  position: relative
  width: 100dvw
  // height: 100dvh
  overflow-y: auto
</style>
<style scoped lang="sass">
iframe
  width: 100dvw
  height: 100dvh
</style>
