<template>
  <div class="service">
    <div class="box form">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle is-6" style="margin-bottom: 0;">{{ subtitle }}</p>
      <hr v-if="A" class="mt-2">
      <div v-if="A" class="content p-2">
        <render v-if="A" :key="md5(A.content)"></render>
        <div class="buttons is-flex is-justify-content-center">
          <button class="button is-primary is-rounded mt-6 pr-6 pl-6" :class="{ 'is-loading': loading }" @click="submit">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import Render from '../components/Render.vue'
import axios from '../plugins/axios.js'
import { A, U, token } from '../plugins/state.js'
import { clock, ms2Str } from '../plugins/clock.js'
import { md5 } from '../plugins/convention.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(), router = useRouter()

ref: start = 0
let oldData
A.value = null
const title = computed(() => {
  if (start) return '距离事务开始还有' + ms2Str(A.value.start - clock.value)
  return A.value ? A.value.title : '正在载入...'
})
const subtitle = computed(() => {
  if (start) return '倒计时结束将自动载入事务，无需反复刷新'
  if (!A.value) return '请耐心等待，无需反复刷新'
  let res = A.value.anonymous ? '匿名事务' : '用户：' + (U.value ? U.value.name : '未登录')
  if (A.value.end) res += '， 剩余时间：' + ms2Str(A.value.end - clock.value)
  return res
})
watch(clock, v => {
  if (start && start < v) start = 0
})

async function catchErr (e) {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!e.response) return
  switch (e.response.status) {
    case 404: case 403: {
      if (U.value) router.push('/')
      else router.push('/login?c=' + encodeURIComponent('/#/@/' + route.params.id))
      return
    }
    case 406: {
      start = Number(e.response.data) + Date.now()
      return
    }
  }
  fetch()
}

async function fetch () {
  try {
    const res = await axios.get('/service/' + route.params.id, token())
    A.value = res.data
    if (A.value.duration) A.value.end = A.value.duration + Date.now()
    delete A.value.duration
    oldData = JSON.stringify(A.value.data)
  } catch (e) {
    await catchErr(e)
  }
}
fetch()

ref: loading = false
async function submit () {
  loading = true
  const body = { signature: A.value.signature, data: JSON.parse(oldData) }
  for (const k in A.value.data) {
    if (k[0] == '_') body[k] = A.value.data[k]
  }
  try {
    const target = A.value.target || '/service/'
    const res = await axios.post(target, body, { headers: { ticket: A.value.ticket } })
    const msg = res.data.msg, newAffair = res.data.new
    if (msg) await Swal.fire(msg.title, msg.subtitle || '', msg.icon)
    if (res.data.link) window.location.href = res.data.link
    else if (newAffair) {
      for (const k in newAffair) {
        A.value[k] = newAffair[k]
        if (k === 'data') oldData = JSON.stringify(newAffair[k])
      }
    }
  } catch (e) {
    Swal.fire('错误', e.response ? String(e.response.data) : '网络错误', 'error')
    fetch()
  }
  loading = false
}
</script>

<style scoped>
div.service {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1fffe;
}
div.box.form {
  max-width: 640px;
  width: 100%;
}
@media (max-width: 640px) {
  div.box.form {
    min-height: 100vh;
  }
}
</style>
