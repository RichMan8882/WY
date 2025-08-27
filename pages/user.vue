<script lang="ts" setup>
const router = useRouter()
const siteStore = useSiteStore()
const { signout } = useAuthStore()
const { queryChatbox } = siteStore
const PlayerStore = usePlayerStore()
const ticketStore = useTicketStore()
const { queryTicket } = ticketStore
const intervalId = ref(null)
const checkPath = (link: string) => {
  if (
    router.currentRoute.value.fullPath.replace('/model2', '') ===
    `/user/${link}`
  ) {
    return 'active'
  } else {
    return ''
  }
}
const unreadMessage = () => {
  const list = []
  ticketStore.tickets.forEach((item: any) => {
    if (
      item.thread.find(
        (message: any) => message.role !== 0 && message.read === null
      )
    ) {
      list.push(item)
    }
  })
  return list.length
}
onMounted(async () => {
  if (siteStore.siteData?.smsVerify === 1) {
    if (!PlayerStore.playerInfo?.smsVerify) {
      return navigateTo('/user/smsVerify')
    }
  }

  const queryChatboxPromise = queryChatbox()
  queryChatboxPromise
    .then((queryChatboxRes) => {
      // 處理響應結果
      console.log('queryChatboxRes', queryChatboxRes.data)
    })
    .catch((error) => {
      console.error('Error loading queryChatboxRes data:', error)
    })

  console.log('setInterval queryTicket')
  const queryTicket_INTERVAL = 3 * 1000
  intervalId.value = setInterval(async () => {
    const queryTicketPromise = queryTicket()
    queryTicketPromise
      .then((queryTicketRes) => {
        // 處理響應結果
        if (!queryTicketRes) {
          clearInterval(intervalId.value)
          intervalId.value = null
        }
      })
      .catch((error) => {
        console.error('Error loading queryTicketRes data:', error)
      })
  }, queryTicket_INTERVAL)
})
onBeforeUnmount(() => {
  if (intervalId.value) {
    console.log('clearInterval queryTicket', intervalId.value)
    clearInterval(intervalId.value)
    intervalId.value = null
  }
})
const gameWindowOpen = () => {
  const { isLogin } = useAuthStore()
  if (isLogin()) {
    if (siteStore.siteData?.smsVerify === 1) {
      if (!PlayerStore.playerInfo?.smsVerify) {
        return navigateTo('/user/smsVerify')
      } else {
        window.open(`${window.location.origin}/game`, '_blank')
      }
    } else {
      window.open(`${window.location.origin}/game`, '_blank')
    }
  } else {
    navigateTo('/login')
  }
}
watch(
  () => router.currentRoute.value.name,
  () => {
    if (siteStore.siteData?.smsVerify === 1) {
      if (!PlayerStore.playerInfo?.smsVerify) {
        return router.push('/user/smsVerify')
      }
    }
    if (router.currentRoute.value.name === 'user') {
      return navigateTo('/user/info')
    }
    document.getElementById('form-control').checked = false
  }
)

const pledgeSocketStore = usePledgeSocketStore()

await onMounted(async () => {
  // 判斷gameType 是否有 5 pledge type
  if (siteStore.siteData?.gameType?.find((item: any) => item === 5)) {
    await pledgeSocketStore.startConnectWebSocket()
  }
})
onBeforeUnmount(() => {
  // 判斷gameType 是否有 5 pledge type
  if (siteStore.siteData?.gameType?.find((item: any) => item === 5)) {
    pledgeSocketStore.closeWebSocket()
  }
})
onMounted(() => {
  if (window) {
    console.log('window', window.innerWidth)
    window.addEventListener('scroll', handleScroll)
  }
})
const scrollTop = ref(0)
const handleScroll = () => {
  scrollTop.value = window.scrollY
}
onUnmounted(() => {
  if (window) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>
<template>
  <div class="page-cont">
    <client-only>
      <router-view></router-view>
    </client-only>
  </div>
</template>
<style scoped lang="sass"></style>
