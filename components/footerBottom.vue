<script lang="ts" setup>
const siteStore = useSiteStore()
const { isLogin, signout } = useAuthStore()
</script>
<template>
  <footer>
    <div class="footer-bottom">
      <div class="links">
        <dl>
          <dt>關於我們</dt>
          <dd>
            <a @click="navigateTo('/')">品牌故事</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">公司資訊</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">購買通路</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">異業合作</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">校園贊助</a>
          </dd>
        </dl>
      </div>
      <div class="links">
        <dl>
          <dt>精選推薦</dt>
          <dd>
            <a @click="navigateTo('/')">W 專欄</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">小編來開箱</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">YT 商品介紹</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">KOL 好評分享</a>
          </dd>
        </dl>
      </div>
      <div class="links">
        <dl>
          <dt>購物須知</dt>
          <dd>
            <a @click="navigateTo('/')">會員福利</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">購物說明</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">退換貨政策</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">隱私權政策</a>
          </dd>
        </dl>
      </div>
      <div class="links">
        <dl>
          <dt>聯絡我們</dt>
          <dd>
            <a @click="navigateTo('/')">電話 / 0905-400200</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">時間 / 週一至週五 09:30-18:30</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">電郵 / onemoretw321@gmail.com</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">地址 / 高雄市新興區民權一路251號28樓</a>
          </dd>
          <dd>
            <a @click="navigateTo('/')">（僅開放電話預約取貨）</a>
          </dd>
        </dl>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="copyright">
        <h5>
          提醒您：WINYI 不會要求提供金融資料或操作
          ATM，遇可疑來電請勿理會。可洽客服 0905400200 或撥打 165
          反詐騙專線查證。
        </h5>
        <h5>2020 © Winyi Co.,Ltd. All Rights Reserved</h5>
      </div>
    </div>
  </footer>
</template>
<style scoped lang="sass">
footer
  background: #fbf7ef
  padding-top: 60px
  color: #333
  @media (max-width:768px)
    padding-top: 40px
  .footer-bottom
    width: 1200px
    margin: 0 auto 60px
    display: flex
    justify-content: center
    gap: 100px
    flex-wrap: wrap
    @media (max-width: 1200px)
      width: 100%
      padding: 0 20px
    @media (max-width: 768px)
      gap: 0px
      padding-bottom: 30px
    .introduce
      max-width: 25%
      padding-inline: 14px
      margin-bottom: 20px
      @media (max-width: 768px)
        max-width: 100%
      .footer-logo
        height: 55px
        margin-bottom: 30px
        img
          height: 100%
      .footer-info
        font-size: 14px
    .links,.connect
      padding-inline: 14px
      max-width: 25%
      @media (max-width: 768px)
        max-width: 100% !important
        width: 100%
      dl
        margin-top: 20px
        dt
          font-size: 18px
          text-align: center
          color: #333
          margin-bottom: 28px
        dd
          font-size: 14px
          margin-bottom: 8px
          .icon
            fill: #b6b6b6
            margin-right: 8px
            width: 16px
            height: 16px
            display: inline-block
          a
            display: inline-block
            text-align: center
            width: 100%
            transition: color .3s ease
            // &:hover
            //   color: #fff
  .footer-copyright
    text-align: center
    color: #999
    padding: 32px 12px 0
    background: #f7f7f7
    .copyright
      h5
        font-size: 12px
        padding: 0 0 30px
</style>
