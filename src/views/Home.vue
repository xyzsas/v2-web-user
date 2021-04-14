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
    <loading v-if="loading"><p style="margin: 0;">正在载入消息...</p></loading>
    <p v-if="!loading && msg.length === 0" style="text-align: center">暂时没有消息</p>
    <div class="columns is-tablet">
      <div class="column" v-for="c in columns">
        <div v-for="i in c" class="box">
          <h4 v-if="i[0]">{{ i[0] }}</h4>
          <p v-if="i[1]">{{ i[1] }}</p>
          <a v-if="i[2]" class="button is-fullwidth is-outlined is-primary" :href="i[2]">点击前往</a>    
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Loading from '../components/Loading.vue'
import axios from '../plugins/axios'

const router = useRouter()
const SS = window.sessionStorage
const location = window.location

ref: msg = []
const columns = computed(() => {
  const res = [[], [], []]
  let cot = 0
  for (const m of msg) {
    res[cot].push(m)
    cot++
    cot %= 3
  }
  return res
})
ref: loading = true

async function getMsg () {
  axios
    .get('/msg/', { headers: { token: SS.token } })
    .then(({ data }) => {
      loading = false
      msg = []
      for (const k in data) msg.push(data[k].split('$$'))
      msg.reverse()
    })
    .catch(async err => {
      await Swal.fire('错误', err.response ? err.response.data : '网络错误', 'error')
      router.push('/login')
    })
}

if (!SS.token) router.push('/login')
else getMsg()

const greet = (() => {
  const h = new Date().getHours()
  if (h < 11) return '早上好'
  if (h >= 11 && h < 13) return '中午好'
  if (h >= 13 && h < 18) return '下午好'
  if (h >= 18) return '晚上好'
})()

function admin () {
  window.open('/admin/', '/admin/', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,top=0,left=0,height=600,width=800')
}
</script>

<style scoped>
div.container {
  width: 100%;
  height: 100vh;
  padding: 24px;
}
</style>