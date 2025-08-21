<script lang="ts" setup>
// import
const { t } = useI18n()
const siteStore = useSiteStore()
const PlayerStore = usePlayerStore()
const orderStore = useOrderStore()
const { queryKlines, queryRounds, queryOrder, bet } = useGameStore()
const { getListenkey } = PlayerStore
const { locale } = useI18n()
const lang = locale.value
const { queryInstruction, queryNews } = useSiteStore()
const router = useRouter()
const timeoutId = ref(null)
const hourDegrees = ref(0)
const minuteDegrees = ref(0)
const secondDegrees = ref(0)
const record = ref({
  title: t('當前委託'),
  type: 'currentOrder',
  search: true
})
const search = ref({
  symbol: '',
  roundNo: '',
  dateRangeStart: '',
  dateRangeEnd: '',
  limit: 60,
  page: 1,
  pageSize: 100
})
const showToolPopup = ref(false)
const symbol = ref('')
const symbolData: any = ref(null)
const availableCurrency: any = ref([])
const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
const socket: any = ref(null)
const socketConnected = ref(false)
const betData = ref({
  playerId: PlayerStore.playerInfo.id,
  option: [],
  amount: '',
  roundNo: ''
})
const recordList = ref([])
const historyRecordList = ref([])
// 圖表數據值
const nowTimestamp: any = ref(null)
const socketNewPrice: any = ref(null)
const isFirstGet = ref(true)
const createChartData = ref(null)
const socketCurrentRoundCountdown = ref(0)
const news = ref(null)
const rule = ref(null)
const disableBet = ref(false)
const currentSelectSymbolPrice = ref(0)
const playerWalletBalance = computed(() => {
  const findWallet = PlayerStore.playerInfo.wallet.find(
    (wallet: any) => wallet.type === 1
  )
  if (findWallet) {
    return Number(findWallet.balance)
  } else {
    return 0
  }
})
const selectSymbol = (value: any) => {
  symbol.value = value.symbol
  symbolData.value = value.symbolData
  closeWebSocket()
  document.getElementById('coinBox').checked = false
}

// method
const goPopup = async (title: string) => {
  console.log('recordList', recordList)
  record.value.title = title
  showToolPopup.value = true
  search.value.symbol = symbol.value
  // 確認order數據

  if (title === t('當前委託')) {
    orderList.value = socketOrderList.value.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    record.value.type = 'currentOrder'
    record.value.search = true
    return
  }
  if (title === t('歷史委託')) {
    orderList.value = socketOrderList.value.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    record.value.type = 'historyOrder'
    record.value.search = true
    return
  }
  if (title === t('歷史盤口')) {
    record.value.title = ' 歷史總覽'
    record.value.type = 'historyRecord'
    const response = await queryRounds({
      symbol: symbol.value,
      limit: 60,
      page: 1,
      pageSize: 100
    })
    console.log('queryRounds', response.data.result)
    historyRecordList.value = response.data.result.filter((item: any) => {
      return Number(item.roundNo) < Number(betData.value.roundNo)
    })
    console.log('betData.value.roundNo', betData.value.roundNo)
    console.log('queryRounds', historyRecordList.value)
    record.value.search = true
    return
  }
  if (title === t('網站公告')) {
    record.value.type = 'announcement'
    record.value.search = false
    return
  }
  if (title === t('規則說明')) {
    record.value.type = 'rule'
    record.value.search = false
  }
}
const closePopup = () => {
  showToolPopup.value = false
}
const connectRecordList = computed(() => {
  const title = record.value.type
  switch (title) {
    case 'currentOrder':
      orderList.value = socketOrderList.value
        .filter((item: any) => item.status === 0)
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
      return orderList.value
    case 'historyOrder':
      orderList.value = socketOrderList.value
        .filter((item: any) => item.status === 1)
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        })
      return orderList.value
  }
})
const addBetGameType = (type: string) => {
  if (betData.value.option.includes(type)) {
    betData.value.option = betData.value.option.filter((item) => item !== type)
  } else {
    betData.value.option.push(type)
  }
  console.log(betData.value.option)
}
const checkBetData = () => {
  if (!disableBet.value) {
    disableBet.value = true
    try {
      betData.value.productId = symbolData.value.id
      console.log(betData.value)
      const pairData = symbolData.value
      console.log('pairData', pairData)
      // banned action
      if (pairData.banned) {
        ElNotification({
          message: pairData.notice,
          type: 'error',
          showClose: false
        })
        return
      }
      // banned player
      const bannedPlayer = pairData.bannedPlayers.find(
        (item: any) => item.playerId === PlayerStore.playerInfo?.id
      )
      if (bannedPlayer) {
        if (bannedPlayer.banned) {
          ElNotification({
            message: bannedPlayer.reason,
            type: 'error',
            showClose: false
          })
          return
        }
      }
      if (betData.value.amount === '') {
        ElNotification({
          message: `${t('請輸入下單金額')}`,
          type: 'error',
          showClose: false
        })
        return
      }
      if (betData.value.option.length === 0) {
        ElNotification({
          message: `${t('請選擇參與遊戲模式')}`,
          type: 'error',
          showClose: false
        })
        return
      }
      if (
        parseFloat(betData.value.amount) < symbolData.value.config.minBetAmount
      ) {
        ElNotification({
          message: ` ${t('最低交易金額為')} $ ${symbolData.value.config.minBetAmount}`,
          type: 'error',
          showClose: false
        })
        return
      }
      if (
        parseFloat(betData.value.amount) > symbolData.value.config.maxBetAmount
      ) {
        ElNotification({
          message: `${t('最高交易金額為')} $ ${symbolData.value.config.maxBetAmount}`,
          type: 'error',
          showClose: false
        })
        return
      }
      setTimeout(
        async () => {
          betData.value.amount = betData.value.amount.toString()
          const response = await bet(betData.value)
          console.log('bet response', response)
          if (response.success) {
            ElMessageBox.alert(
              `
               <p style="margin:0 0 8px 0"> ${t('投注期別')}: ${response.data.roundNo} </p>
               <p style="margin:0 0 8px 0"> ${t('投注匯率')}: ${
                 response.data.openPrice
               } </p>
               <p style="margin:0 0 8px 0"> ${t('下注金額')}: ${response.data.amount} </p>
               <p style="margin:0 0 8px 0"> ${t('下注類別')}: ${gameOptionNameList(
                 response.data.option
               )} </p>
               <p style="margin:0 0 8px 0"> ${t('時間')}: ${formatDate(
                 response.data.openAt
               )} </p>
             `,
              `${t('下單成功')}`,
              {
                confirmButtonText: `${t('確認')}`,
                center: true,
                dangerouslyUseHTMLString: true
              }
            )
          } else {
            // ElNotification({
            //   title: response.message,
            //   type: 'error',
            //   showClose: false
            // })
          }
          clearBetData()
          await PlayerStore.fetchInfo()
        },
        bannedPlayer ? (bannedPlayer.delay + 1) * 1000 : 1000
      )
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        disableBet.value = false
      }, 3000)
    }
  }
}
const gameOptionOdd = (type: number) => {
  switch (type) {
    case 0:
      return symbolData.value
        ? symbolData.value.config.option[0].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 1:
      return symbolData.value
        ? symbolData.value.config.option[1].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 2:
      return symbolData.value
        ? symbolData.value.config.option[2].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 3:
      return symbolData.value
        ? symbolData.value.config.option[3].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 4:
      return symbolData.value
        ? symbolData.value.config.option[4].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 5:
      return symbolData.value
        ? symbolData.value.config.option[5].odds * 100 + '%'
        : 0.1 * 100 + '%'
    case 6:
      return symbolData.value
        ? symbolData.value.config.option[6].odds * 100 + '%'
        : 0.1 * 100 + '%'
    default:
      return ''
  }
}

const showOption = (type: number) => {
  switch (type) {
    case 0:
      return symbolData.value ? symbolData.value.config.option[0].isOpen : false
    case 1:
      return symbolData.value ? symbolData.value.config.option[1].isOpen : false
    case 2:
      return symbolData.value ? symbolData.value.config.option[2].isOpen : false
    case 3:
      return symbolData.value ? symbolData.value.config.option[3].isOpen : false
    case 4:
      return symbolData.value ? symbolData.value.config.option[4].isOpen : false
    case 5:
      return symbolData.value ? symbolData.value.config.option[5].isOpen : false
    case 6:
      return symbolData.value ? symbolData.value.config.option[6].isOpen : false
    default:
      return true
  }
}

const clearBetData = () => {
  betData.value = {
    playerId: PlayerStore.playerInfo.id,
    productId: '',
    option: [],
    amount: '',
    roundNo: ''
  }
  document.getElementById('game-1').checked = false
  document.getElementById('game-2').checked = false
  document.getElementById('game-3').checked = false
  document.getElementById('game-4').checked = false
  document.getElementById('game-5').checked = false
  document.getElementById('game-6').checked = false
  document.getElementById('game-7').checked = false
}

const initMilliseconds = (timestamp: any) => {
  const newDate = new Date(timestamp)
  newDate.setMilliseconds(0)
  return newDate.getTime()
}

const randomVolume = () => {
  return parseFloat((Math.random() * 100 + 1).toFixed(2))
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const gameOptionNameList = (list: Array) => {
  const result = []
  list.forEach((item) => {
    result.push(gameOptionName(item))
  })
  return result.join(', ')
}
const gameOptionName = (type: Number) => {
  switch (type) {
    case 0:
      return `${t('高')}`
    case 1:
      return `${t('低')}`
    case 2:
      return `${t('單')}`
    case 3:
      return `${t('雙')}`
    case 4:
      return `${t('漲')}`
    case 5:
      return `${t('跌')}`
    case 6:
      return `${t('反指標')}`
    default:
      return ''
  }
}
const gameResultName = (type: Number) => {
  // 0 : 高、1 : 低、2 : 單、3 : 雙、4 : 漲、5 : 跌 6 : 合
  switch (type) {
    case 0:
      return `${t('高')}`
    case 1:
      return `${t('反指標')}`
    case 2:
      return `${t('單')}`
    case 3:
      return `${t('雙')}`
    case 4:
      return `${t('漲')}`
    case 5:
      return `${t('跌')}`
    case 6:
      return `${t('和')}`
    default:
      return `${t('未知')}`
  }
}
const getChartData = async (timestamp: any) => {
  // 取得遠端資料
  // 取 3 分鐘的資料
  const now = new Date(nowTimestamp.value)
  now.setSeconds(0, 0)
  now.setMinutes(now.getMinutes() - 3)
  const startTime = now.getTime()
  const endTime = timestamp
  // const data = {
  //   symbol: symbol.value,
  //   interval: '1',
  //   startTime,
  //   endTime
  // }
  // console.log(symbolData.value)
  const data = {
    productId: symbolData.value.id
  }
  const klineData = await queryKlines(data)
  if (klineData.success) {
    isFirstGet.value = false // 第一次獲取開關關閉
    const { result } = klineData.data
    // console.log('klines', result)
    const newKLines = Object.entries(result).map(([timestamp, value]) => {
      const volume = randomVolume()
      const turnover = Number(value.close) * volume
      return {
        timestamp: Number(timestamp) * 1000,
        open: Number(value.open),
        close: Number(value.close),
        high: Number(value.high),
        low: Number(value.low),
        volume,
        turnover
      }
    })
    createChartData.value = { newKLines, time: timestamp }
  }
}

const searchOrder = async () => {
  const startDate = new Date(search.value.dateRangeStart)
  search.value.dateRangeStart = startDate.getTime()
  const endDate = new Date(search.value.dateRangeEnd)
  search.value.dateRangeEnd = endDate.getTime()
  console.log('searchOrder', search.value)
  if (!search.value.dateRangeStart) {
    delete search.value.dateRangeStart
  }
  if (!search.value.dateRangeEnd) {
    delete search.value.dateRangeEnd
  }
  if (record.value.type !== 'historyRecord') {
    const response = await queryOrder(search.value)
    if (response.success) {
      orderList.value = response.data.result
    } else {
      ElNotification({
        message: response.message,
        type: 'error'
      })
    }
  } else {
    // 搜尋盤口
    const response = await queryRounds(search.value)
    if (response.success) {
      historyRecordList.value = response.data.result
    } else {
      ElNotification({
        message: response.message,
        type: 'error'
      })
    }
  }
  search.value.dateRangeStart = ''
  search.value.dateRangeEnd = ''
  search.value.roundNo = ''
}

const pickerOptions = {
  daterange: {
    maxTime: '', // 最大日期
    minTime: '', // 最小日期
    max: 30 // 限制范围 30天
  }
}
const disabledDate = (time) => {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  return time.getTime() < threeMonthsAgo.getTime()
}

const productList: any = ref([])

const orderList: any = ref([])
const socketOrderList: any = ref([])
const ogOrderList: any = ref(null)
// ctyptoData
const reconnected = ref(true)
const closeWebSocket = async () => {
  if (socket.value) {
    socket.value.close()
  }
}

const sendMessage = (msg: any) => {
  // send message to server
  socket.value.send(JSON.stringify(msg))
}

// // 連接 socket
// const startConnectWebSocket = async () => {
//   const getListenkeyRes = await getListenkey()
//   console.log('getListenkeyRes', getListenkeyRes)
//   const runtimeConfig = useRuntimeConfig()
//   const { SOCKETBASE } = runtimeConfig.public
//   socket.value = new WebSocket(
//     `${SOCKETBASE}/${getListenkeyRes.data.listenkey}`
//   )
//   socket.value.onopen = (event) => {
//     // console.log('Connected to socket', event)
//     socketConnected.value = true
//     sendMessage({
//       op: 'subscribe',
//       channel: ['kline', 'order', 'product']
//     })
//   }
//   socket.value.onmessage = async (e) => {
//     const message = JSON.parse(e.data)
//     // console.log('收到來自 socket 的訊息', message);
//     const { event, data } = message
//     switch (event) {
//       case 'PRODUCT_UPDATE': {
//         // console.log('PRODUCT_UPDATE', data)
//         productList.value = data.result
//         if (symbolData.value === null) {
//           symbol.value = productList.value[0].symbol
//           symbolData.value = productList.value[0]
//         }
//         break
//       }
//       case 'ORDER_UPDATE': {
//         // console.log('ORDER_UPDATE', data)
//         socketOrderList.value = data.result
//       }
//       case 'KLINE_UPDATE': {
//         // console.log('KLINE_UPDATE', data)
//         if (productList.value.length > 0) {
//           productList.value.forEach((item: any) => {
//             const findSystemPrice = data.result.find(
//               (socketData: any) => socketData.symbol === item.symbol
//             )
//             // console.log('findSystemPrice', findSystemPrice)

//             const currency = availableCurrency.value.find(
//               (currency: any) => currency.symbol === item.symbol
//             )
//             if (currency) {
//               currency.price.push({
//                 open: parseFloat(
//                   currency.price[currency.price.length - 1].close
//                 ),
//                 close: findSystemPrice.price
//                   ? parseFloat(findSystemPrice.price.close)
//                   : 0
//               })
//             } else {
//               availableCurrency.value.push({
//                 symbol: item.symbol,
//                 price: [
//                   {
//                     open: findSystemPrice.price
//                       ? parseFloat(findSystemPrice.price.open)
//                       : 0,
//                     close: findSystemPrice.price
//                       ? parseFloat(findSystemPrice.price.close)
//                       : 0
//                   }
//                 ],
//                 symbolData: item
//               })
//             }
//           })
//         }

//         // 圖表列表數據
//         const { timestamp: correctTimestamp } = message
//         const lastTimestamp = Math.floor(nowTimestamp.value / 1000)
//         if (lastTimestamp !== Math.floor(correctTimestamp / 1000)) {
//           const timestamp = initMilliseconds(correctTimestamp)
//           nowTimestamp.value = timestamp
//           const symbolData = data.result.find(
//             (item) => item.symbol === symbol.value
//           )
//           // console.log('symbol.value', symbol.value)
//           // console.log('symbolData', symbolData)
//           // 已選擇數據整理
//           if (symbolData) {
//             const { price } = symbolData
//             // 數據整理
//             let newPrice = Object.entries(price).reduce((acc, [key, value]) => {
//               acc[key] = parseFloat(value)
//               return acc
//             }, {})
//             const volume = randomVolume()
//             const turnover = newPrice.close * volume
//             newPrice = {
//               timestamp,
//               ...newPrice,
//               turnover,
//               volume
//             }
//             socketNewPrice.value = newPrice

//             // 第一次取得所有數據 & 產生空資料
//             if (isFirstGet.value) getChartData(timestamp)

//             // currentSelectSymbolPrice
//             currentSelectSymbolPrice.value = price.close
//           }
//         }
//         break
//       }
//       case 'SERVER_TIME': {
//         const {
//           currentRoundId,
//           currentRoundCountdown,
//           allowBetRoundId,
//           allowBetRoundCountdown
//         } = data
//         betData.value.roundNo = allowBetRoundId
//         socketCurrentRoundCountdown.value = allowBetRoundCountdown
//         // console.log(data);
//         if (currentRoundCountdown === 59) {
//           await PlayerStore.fetchInfo()
//           // const queryOrderRes = await orderStore.queryOrder({
//           //   pair: symbol.value
//           // })
//           // recordList.value = queryOrderRes.data.result
//         }
//         break
//       }
//       default:
//         break
//     }
//   }
//   socket.value.onclose = async () => {
//     console.log('Disconnected from socket')
//     isFirstGet.value = true
//     socketConnected.value = false
//     if (reconnected) {
//       await startConnectWebSocket()
//       console.log('reconnected to socket')
//     }
//   }

//   socket.value.onerror = (error) => {
//     socketConnected.value = false
//     console.error('WebSocket error:', error)
//   }
// }
// 更新時鐘的函數
const updateClock = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  hourDegrees.value = (hours % 12) * 30 + minutes * 0.5
  minuteDegrees.value = minutes * 6
  secondDegrees.value = seconds * 6
}

// 初次呼叫更新時鐘
updateClock()

// 定義一些狀態變數和函數
const currentTime = ref('')
const countdown60 = ref(60)
const countdown70 = ref(70)
const inputValue = ref(50)
const counting = ref({
  ers: 33.71,
  sers: 3.3,
  ber: 400,
  es: 70
})

const updateCountingNumber = (value, min, max, fixed) => {
  counting.value[value] = parseFloat(
    (Math.random() * (max - min) + min).toFixed(fixed)
  )
}

// 更新當前時間的函數
const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

// 更新 60 秒倒數計時的函數
const updateCountdown60 = () => {
  if (countdown60.value > 0) {
    countdown60.value--
  } else {
    countdown60.value = 60
  }
}

// 更新 70 秒倒數計時的函數
const updateCountdown70 = () => {
  if (countdown70.value > 0) {
    countdown70.value--
  } else {
    countdown70.value = 70
  }
}

const ersTimer = ref('')
const sersTimer = ref('')
const berTimer = ref('')
const esTimer = ref('')

// 組件掛載時設置計時器並更新時間和倒數計時
await onMounted(async () => {
  // await startConnectWebSocket()
  document.documentElement.scrollTop = 0

  const pair = symbol.value
  const type = 'game'
  const path = 'game'
  /** await Promise then  */
  // 開始加載數據（此處沒有使用 await，因此主線程不會被阻塞）
  const queryInstructionPromise = queryInstruction(lang, type)
  const queryNewsPromise = queryNews(lang, path)
  // 使用 .then() 方法處理異步任務結果
  queryInstructionPromise
    .then((queryInstructionRes) => {
      // 處理響應結果
      rule.value = queryInstructionRes.data
    })
    .catch((error) => {
      console.error('Error loading instruction data:', error)
    })

  queryNewsPromise
    .then((queryNewsRes) => {
      // 處理響應結果
      news.value = queryNewsRes.data
    })
    .catch((error) => {
      console.error('Error loading news data:', error)
    })
  /** await Promise then  */

  // const resetTimer = () => {
  //   if (timeoutId) {
  //     clearTimeout(timeoutId.value)
  //   }
  //   timeoutId.value = setTimeout(
  //     () => {
  //       navigateTo('/user')
  //     },
  //     siteStore.siteData?.gameCenterOutInterval
  //       ? siteStore.siteData?.gameCenterOutInterval * 60 * 1000
  //       : 5 * 60 * 1000
  //   ) // 5 分钟
  // }
  // window.onload = resetTimer
  // window.onmousemove = resetTimer
  // window.onmousedown = resetTimer
  // window.ontouchstart = resetTimer
  // window.onclick = resetTimer
  // window.onscroll = resetTimer
  // window.onkeypress = resetTimer

  updateTime()

  ersTimer.value = setInterval(
    () => updateCountingNumber('ers', 30, 50, 2),
    1000
  )
  sersTimer.value = setInterval(
    () => updateCountingNumber('sers', 3, 8, 1),
    1000
  )
  berTimer.value = setInterval(
    () => updateCountingNumber('ber', 400, 600, 1),
    1000
  )
  esTimer.value = setInterval(() => updateCountingNumber('es', 70, 90, 1), 1000)
})

// 組件卸載時清除計時器
onUnmounted(() => {})

onBeforeUnmount(() => {
  clearInterval(ersTimer)
  clearInterval(sersTimer)
  clearInterval(berTimer)
  clearInterval(esTimer)
  reconnected.value = false
  // console.log('closeWebSocket', reconnected.value)
  closeWebSocket()
})

// 處理加法按鈕事件的函數
const addToInput = (value) => {
  betData.value.amount = value
}

const cryptoSelect = ref(false)
const openCryptoSelect = () => {
  cryptoSelect.value = !cryptoSelect.value
}
const cryptoName = (crypto) => {
  switch (crypto.symbol) {
    case 'BTCUSDT':
      return '太陽能'
    case 'WFEURUSD':
      return '風能'
    case 'WFGBPUSD':
      return '地熱能'
    case 'WFUSDTWD':
      return '海洋能'
    default:
      return crypto.label || crypto.name || crypto.symbol
  }
}
// action methods
const symbolChange = (symbol: string) => {
  switch (symbol) {
    case 'BTCUSDT':
      return '太陽能'
    case 'WFEURUSD':
      return '風能'
    case 'WFGBPUSD':
      return '地熱能'
    case 'WFUSDTWD':
      return '海洋能'
    default:
      return ''
  }
}
const betFormatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k'
  } else {
    return num.toString()
  }
}
const betAmountsList = computed(() => {
  if (symbolData.value) {
    return symbolData.value.config.betAmount
  } else {
    return []
  }
})
const changeLang = (value) => {
  locale.value = value
  console.log('change lang', locale.value)
}
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k'
  } else {
    return num.toString()
  }
}
import SGB from '@/assets/images/icon/SGB.svg'
import WECAN from '@/assets/images/icon/WECAN.svg'
import LMWR from '@/assets/images/icon/LMWR.svg'
import TRUMP from '@/assets/images/icon/TRUMP.svg'
import MELANIA from '@/assets/images/icon/MELANIA.svg'
import SYRUP from '@/assets/images/icon/SYRUP.svg'
import IMX from '@/assets/images/icon/IMX.svg'
import Bitcoin from '@/assets/images/icon/Bitcoin.svg'
import ETH from '@/assets/images/icon/ETH.svg'
import Tether from '@/assets/images/icon/Tether.svg'
import XRP from '@/assets/images/icon/XRP.svg'
import SOL from '@/assets/images/icon/SOL.svg'
import GO from '@/assets/images/icon/GO.svg'
import ADA from '@/assets/images/icon/ADA.svg'

const currencyAll = ref([
  {
    symbol: 'ADA',
    name: 'Cardano',
    marketCap: 244000,
    icon: ADA,
    price: 0.68998,
    point: -1.19
  },
  {
    symbol: 'GO',
    name: 'Dogecoin',
    marketCap: 259000,
    icon: GO,
    price: 0.17347,
    point: -2.54
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    marketCap: 753000,
    icon: SOL,
    price: 145.479,
    point: -1.08
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    marketCap: 1279000,
    icon: XRP,
    price: 2.18565,
    point: -0.08
  },
  {
    symbol: 'Tether',
    name: 'USDT',
    marketCap: 1487000,
    icon: Tether,
    price: 1.00013,
    point: -0.01
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    marketCap: 22070000,
    icon: ETH,
    price: 1827.9,
    point: 0.44
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    marketCap: 190000000,
    icon: Bitcoin,
    price: 95441,
    point: -0.48
  },
  {
    symbol: 'WECAN',
    name: 'WECAN Wecan Group',
    marketCap: 280,
    icon: WECAN,
    price: 0.00359,
    point: 20.07
  },
  {
    symbol: 'IMX',
    name: 'Immutable X',
    marketCap: 9995,
    icon: IMX,
    price: 0.55,
    point: -11.29
  },
  {
    symbol: 'LMWR',
    name: 'LimeWire',
    marketCap: 3540,
    icon: LMWR,
    price: 0.1069,
    point: 6.05
  },
  {
    symbol: 'SGB',
    name: 'Songbird',
    marketCap: null,
    icon: SGB,
    price: 0.00673,
    point: 18.69
  },
  {
    symbol: 'SYRUP',
    name: 'Syrup',
    marketCap: 1874,
    icon: SYRUP,
    price: 0.17649,
    point: 1.72
  },
  {
    symbol: 'MELANIA',
    name: 'Melania Meme',
    marketCap: null,
    icon: MELANIA,
    price: 0.362,
    point: -10.17
  }
])
const evaluateData = ref({
  up: [
    {
      symbol: 'SGB',
      name: 'SGB',
      marketCap: null,
      icon: SGB,
      price: 0.00673,
      point: 18.69
    },
    {
      symbol: 'WECAN',
      name: 'WECAN Wecan Group',
      marketCap: 280,
      icon: WECAN,
      price: 0.00359,
      point: 20.07
    },
    {
      symbol: 'LMWR',
      name: 'LMWR',
      marketCap: 3540,
      icon: LMWR,
      price: 0.1069,
      point: 6.05
    }
  ],
  down: [
    {
      symbol: 'TRUMP',
      name: 'Official Trump',
      marketCap: 220000,
      icon: TRUMP,
      price: 11.07,
      point: -14.19
    },
    {
      symbol: 'IMX',
      name: 'Immutable X',
      marketCap: 9995,
      icon: IMX,
      price: 0.55,
      point: -11.29
    },
    {
      symbol: 'MELANIA',
      name: 'Melania Meme',
      marketCap: null,
      icon: MELANIA,
      price: 0.362,
      point: -10.17
    }
  ],
  sumUp: [
    {
      symbol: 'TRUMP',
      name: 'Official Trump',
      marketCap: 220000,
      icon: TRUMP,
      price: 11.07,
      point: -14.19
    },
    {
      symbol: 'MELANIA',
      name: 'Melania Meme',
      marketCap: null,
      icon: MELANIA,
      price: 0.362,
      point: -10.17
    },
    {
      symbol: 'SYRUP',
      name: 'Syrup',
      marketCap: 1874,
      icon: SYRUP,
      price: 0.17649,
      point: 1.72
    }
  ]
})
</script>

<template>
  <div class="cont" id="Base_Member">
    <headerTop
      :opaque="true"
      :menu="false"
      :styles="'background: #f2f2f2 !important;box-shadow: none;'"
      routerCrt="/"
      headerW100="height:56px"
    />
    <main>
      <div class="game-banner">
        <div class="banner-box">
          <div class="banner-text">
            <h2>
              <span>購買和交易</span>輕鬆在值得信賴的加密貨幣交易所進行交易。
            </h2>
            <p>
              專為簡潔而設計，以信任為基石，安全可靠，安心無憂。自 2011
              年以來，我們始終是您值得信賴的交易所。
            </p>
            <div class="btn" @click="navigateTo('/game/cointrading')">
              開 始
            </div>
          </div>
        </div>
      </div>
      <div class="game-home-bg">
        <div class="game-home-content">
          <div class="game-home-content-tit">市場</div>
          <div class="game-home-content-list">
            <div class="game-home-content-list-items">
              <div class="list-item-title">
                表現最佳的資產
                <svg
                  t="1746350553200"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="6252"
                  width="200"
                  height="200"
                >
                  <path
                    d="M723.18922555 300.81077445c7.54247257 7.54247257 12.06795526 18.1019336 12.06795597 30.16988957l0 362.03867196c0 24.13591194-18.1019336 42.23784553-42.23784554 42.23784554-24.13591194 0-42.23784553-18.1019336-42.23784553-42.23784554L650.78149116 373.21850884l-319.80082714 7.1e-7c-24.13591194 0-42.23784553-18.1019336-42.23784554-42.23784553 0-24.13591194 18.1019336-42.23784553 42.23784554-42.23784554l362.03867196 0c12.06795526 0 22.627417 4.5254834 30.16988957 12.06795597z"
                    p-id="6253"
                  ></path>
                  <path
                    d="M708.10428041 315.89571959c16.59343937 16.59343937 16.59343937 43.74633977 7.1e-7 60.33977842L361.15055358 723.18922555c-16.59343937 16.59343937-43.74633977 16.59343937-60.33977913 0s-16.59343937-43.74633977 0-60.33977913l346.95372754-346.95372754c16.59343937-16.59343937 43.74633977-16.59343937 60.33977842 7.1e-7z"
                    p-id="6254"
                  ></path>
                </svg>
              </div>
              <div v-for="(item, index) in evaluateData.up" class="list-item">
                <div class="item-left">
                  <img :src="item.icon" />
                  <span>{{ item.symbol }}</span>
                </div>
                <div class="item-center">
                  <span class="item-gary">${{ item.price }}</span>
                </div>
                <div class="item-right">
                  <span :class="item.point > 0 ? 'up' : 'down'"
                    >{{ item.point > 0 ? '+' : '' }}{{ item.point }}</span
                  >
                </div>
              </div>
            </div>
            <div class="game-home-content-list-items">
              <div class="list-item-title">
                表现最差的資產
                <svg
                  t="1746350524483"
                  class="icon icon2"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5951"
                >
                  <path
                    d="M723.18922555 723.18922555c-7.54247257 7.54247257-18.1019336 12.06795526-30.16988957 12.06795597l-362.03867196 0c-24.13591194 0-42.23784553-18.1019336-42.23784554-42.23784554 0-24.13591194 18.1019336-42.23784553 42.23784554-42.23784553L650.78149116 650.78149116l-7.1e-7-319.80082714c0-24.13591194 18.1019336-42.23784553 42.23784553-42.23784554 24.13591194 0 42.23784553 18.1019336 42.23784554 42.23784554l0 362.03867196c0 12.06795526-4.5254834 22.627417-12.06795597 30.16988957z"
                    p-id="5952"
                  ></path>
                  <path
                    d="M708.10428041 708.10428041c-16.59343937 16.59343937-43.74633977 16.59343937-60.33977842 7.1e-7L300.81077445 361.15055358c-16.59343937-16.59343937-16.59343937-43.74633977 0-60.33977913s43.74633977-16.59343937 60.33977913 0l346.95372754 346.95372754c16.59343937 16.59343937 16.59343937 43.74633977-7.1e-7 60.33977842z"
                    p-id="5953"
                  ></path>
                </svg>
              </div>
              <div v-for="(item, index) in evaluateData.down" class="list-item">
                <div class="item-left">
                  <img :src="item.icon" />
                  <span>{{ item.symbol }}</span>
                </div>
                <div class="item-center">
                  <span class="item-gary">${{ item.price }}</span>
                </div>
                <div class="item-right">
                  <span :class="item.point > 0 ? 'up' : 'down'"
                    >{{ item.point > 0 ? '+' : '' }}{{ item.point }}</span
                  >
                </div>
              </div>
            </div>
            <div class="game-home-content-list-items">
              <div class="list-item-title">
                最後列出
                <svg
                  t="1746350718376"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="7507"
                  width="200"
                  height="200"
                >
                  <path
                    d="M512 938.666667a426.666667 426.666667 0 1 1 0-853.333334 426.666667 426.666667 0 0 1 0 853.333334z m0-85.333334a341.333333 341.333333 0 1 0 0-682.666666 341.333333 341.333333 0 0 0 0 682.666666z m42.666667-341.333333h170.666666v85.333333h-256V298.666667h85.333334V512z"
                    fill="#999999"
                    p-id="7508"
                  ></path>
                </svg>
              </div>
              <div
                v-for="(item, index) in evaluateData.sumUp"
                class="list-item"
              >
                <div class="item-left">
                  <img :src="item.icon" />
                  <span>{{ item.symbol }}</span>
                </div>
                <div class="item-center">
                  <span class="item-gary">${{ item.price }}</span>
                </div>
                <div class="item-right">
                  <span :class="item.point > 0 ? 'up' : 'down'"
                    >{{ item.point > 0 ? '+' : '' }}{{ item.point }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="currency-list">
            <div class="tabs">
              <div class="tab">全部</div>
            </div>
            <div class="list-cont">
              <div class="currency-item">
                <div class="item1 head">資產</div>
                <div class="item2 head">市值</div>
                <div class="item2 head">最後價格</div>
                <div class="item3 head">24小時變化</div>
              </div>
              <div
                class="currency-item"
                v-for="(item, index) in currencyAll.sort((a, b) => {
                  return b.marketCap - a.marketCap
                })"
              >
                <div class="item1">
                  <img :src="item.icon" />
                  <span>{{ item.name }}</span>
                  <span class="abbreviation">{{ item.symbol }}</span>
                </div>
                <div class="item2">
                  {{
                    item.marketCap > 100000000
                      ? (item.marketCap / 100000000).toFixed(1)
                      : item.marketCap > 10000
                        ? (item.marketCap / 10000).toFixed(2)
                        : item.marketCap
                  }}
                  {{
                    item.marketCap < 1
                      ? ''
                      : item.marketCap < 10000
                        ? '萬美元'
                        : item.marketCap > 10000
                          ? '億美元'
                          : item.marketCap > 100000000
                            ? '萬億'
                            : ''
                  }}
                  {{}}
                </div>
                <div class="item2">${{ item.price }}</div>
                <div class="item3">
                  <span :class="item.point > 0 ? 'up-btn' : 'down-btn'"
                    >{{ item.point > 0 ? '+' : '' }}{{ item.point }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footerBottom />
  </div>
</template>
<style scoped lang="sass"></style>
