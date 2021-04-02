<template>
  <div class="container content" v-if="SS.token">
    <h1>{{ greet }}，{{ SS.name }}！</h1>
    <p>用户组：<code>{{ SS.group }}</code></p>

    <div class="field has-addons is-fullwidth">
      <p class="control">
        <button class="button is-primary" @click="router.push('/center')">
          <span class="icon">
            <i class="mdi mdi-account-box-multiple"></i>
          </span>
          <span>个人中心</span>
        </button>
      </p>
      <p class="control">
        <button class="button" @click="router.push('/password')">
          <span class="icon">
            <i class="mdi mdi-key"></i>
          </span>
          <span>修改密码</span>
        </button>
      </p>
      <p class="control" v-show="SS.role === 'ADMIN'">
        <button class="button is-danger" @click="admin">
          <span class="icon">
            <i class="mdi mdi-monitor-dashboard"></i>
          </span>
          <span>管理后台</span>
        </button>
      </p>
    </div>

    <p v-if="loading" style="text-align: center">加载中...</p>
    <p v-if="!loading && msg.length === 0" style="text-align: center">暂时没有消息</p>

    <div v-for="(i, key) in msg" :key="key" class="box content" style="margin-bottom: 24px; max-width: 500px;">
      <h4 v-if="i[0]">{{ i[0] }}</h4>
      <p v-if="i[1]">{{ i[1] }}</p>
      <a v-if="i[2]" class="button is-fullwidth is-outlined is-primary" :href="i[2]">点击前往</a>    
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import axios from '../plugins/axios'

const router = useRouter()
const SS = window.sessionStorage
const location = window.location

ref: msg = []
ref: loading = true

if (!SS.token) router.push('/login')
else axios // get messages
  .get('/msg', { headers: { token: SS.token } })
  .then(({ data }) => {
    loading = false
    msg = data.map(x => x.split('$$'))
  })
  .catch(err => {
    Swal.fire({
      text: err.response ? err.response.data : '网络错误',
      icon: 'error',
      willClose: () => { router.push('/login') }
    })
  })

const greet = (() => {
  const h = new Date().getHours()
  if (h < 11) return '早上好'
  if (h >= 11 && h < 13) return '中午好'
  if (h >= 13 && h < 18) return '下午好'
  if (h >= 18) return '晚上好'
})()

function admin () {
  window.open('/admin/', '/admin/', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=10000,left=10000,height=600,width=800')
}
</script>

<style scoped>
div.container {
  width: 100%;
  max-width: 500px;
  height: 100vh;
  padding: 24px;
}
</style>