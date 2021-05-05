<template>
  <div class="center">
    <div class="box" style="width: 360px;">
      <h1 class="title">个人中心</h1>
      <loading v-if="loading"><p style="margin: 0;">正在载入用户信息...</p></loading>
      <div v-else class="is-flex is-justify-content-space-between">
        <div class="p-3">
          <code class="is-inline-block">id: {{ U.id }}</code>
          <p class="mt-2">姓名：<b>{{ U.name }}</b></p>
          <p class="mt-2">角色：<b>{{ U.role }}</b></p>
          <p class="mt-2">用户组：<br v-if="U.group.length > 8"><code>{{ U.group }}</code></p>
        </div>
        <img :src="img" onerror="this.src = '/img/placeholder.png'" alt="照片" width="130" height="182" @click="router.push('/photo')">
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Loading from '../components/Loading.vue'
import axios from '../plugins/axios'
import { U, token } from '../plugins/state.js'

const router = useRouter()

ref: loading = true
ref: img = ''

async function catchErr (e, jmp = true) {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (jmp) router.push('/')
  return false
}

async function fetch () {
  const urls = await axios.get('/store/', token())
    .then(({ data }) => data)
    .catch(catchErr)
  img = urls.photo
  loading = false
}
if (!U.value) router.push('/login')
else fetch()
</script>

<style scoped>
div.center {
  min-height: 100vh;
  padding: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>