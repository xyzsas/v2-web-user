<template>
  <div class="center">
    <div class="box" style="width: 360px;">
      <h1 class="title">个人中心</h1>
      <p class="subtitle is-6 mt-3" v-if="loading">正在载入...</p>
      <template v-else>
        <div class="is-flex is-justify-content-space-between">
          <div class="p-3">
            <code class="is-inline-block">id: {{ SS.id }}</code>
            <p class="mt-2">姓名：<b>{{ SS.name }}</b></p>
            <p class="mt-2">角色：<b>{{ SS.role }}</b></p>
            <p class="mt-2">用户组：<br v-if="SS.group.length > 8"><code>{{ SS.group }}</code></p>
          </div>
          <img :src="img" onerror="this.src = '/img/placeholder.png'" alt="照片" width="130" height="182" @click="router.push('/photo')">
        </div>
        <div class="mt-6 form">
          <div v-for="(v, k) in profile" class="p-2">
            <label>{{ k }}</label>
            <input type="text" class="input is-small" v-model="profile[k]" placeholder="请填写">
          </div>
          <div class="p-2">
            <button class="button is-primary is-fullwidth mt-3" :class="{ 'is-loading': submitLoading }" @click=
            "submit">提交</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import axios from '../plugins/axios'

const router = useRouter()
const SS = window.sessionStorage
if (!SS.token) router.push('/login')
const opt = { headers: { token: SS.token } }

ref: loading = true
ref: submitLoading = false
ref: img = ''
ref: profile = {
  '身份证': '',
  '家庭住址': '',
  '父亲姓名': '',
  '父亲联系方式': '',
  '母亲姓名': '',
  '母亲联系方式': '',
  '毕业学校': ''
}

async function catchErr (e, jmp = true) {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (jmp) router.push('/')
  return false
}

function getUrl (type) {
  return axios.get('/store?type=' + type, opt)
    .then(({ data }) => data)
    .catch(catchErr)
}

async function fetch () {
  img = await getUrl('photo')
  const pUrl = await getUrl('profile')
  try {
    const res = await axios.get(pUrl)
    for (const k in profile) {
      if (res.data[k]) profile[k] = res.data[k]
    }
  } catch {}
  loading = false
}
fetch()

async function submit () {
  submitLoading = true
  try {
    const res = await axios.post('/store', { type: 'profile' }, opt)
    await axios.put(res.data, profile)
    Swal.fire('提交成功', '', 'success')
  } catch (e) {
    catchErr(e, false)
  }
  submitLoading = false
}
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