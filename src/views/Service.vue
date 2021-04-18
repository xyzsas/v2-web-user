<template>
  <div class="service">
    <div class="box form">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle is-6" style="margin-bottom: 0;">{{ subtitle }}</p>
      <div v-if="affair" class="content">
        <hr v-if="affair" class="mt-2">
        <render v-if="affair" :template="affair.content" :data="affair.data" :vars="affair.vars"></render>
        <div class="buttons is-flex is-justify-content-center">
          <button class="button is-primary is-rounded mt-6 pr-6 pl-6" :class="{ 'is-loading': loading }" @click="submit">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import Render from '../pieces/Render.vue'
import axios from '../plugins/axios.js'
import { PS } from '../plugins/state.js'
import { clock, ms2Str } from '../plugins/clock.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(), router = useRouter()

const SS = window.sessionStorage

ref: affair = null
ref: start = 0
let oldData, signature, ticket
const title = computed(() => {
  if (start) return '距离事务开始还有' + ms2Str(affair.start - clock.value)
  return affair ? affair.title : '正在载入...'
})
const subtitle = computed(() => {
  if (start) return '倒计时结束将自动载入事务，无需反复刷新'
  if (!affair) return '请耐心等待，无需反复刷新'
  let res = affair.anonymous ? '匿名事务' : '用户：' + SS.name
  if (affair.end) res += '， 剩余时间：' + ms2Str(affair.end - clock.value)
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
      if (SS.token) router.push('/')
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
    affair = null
    const res = await axios.get('/service/' + route.params.id, { headers: { token: SS.token } })
    const a = res.data
    if (a.duration) a.end = a.duration + Date.now()
    affair = a
    oldData = JSON.stringify(a.data)
    signature = a.signature
    ticket = a.ticket
    PS.value = a.pieces
    delete a.duration
    delete a.signature
    delete a.ticket
  } catch (e) {
    await catchErr(e)
  }
}
fetch()

ref: loading = false
async function submit () {
  loading = true
  const body = { signature, data: JSON.parse(oldData) }
  for (const k in affair.data) {
    if (k[0] == '_') body[k] = affair.data[k]
  }
  try {
    const target = affair.target || '/service/'
    const res = await axios.post(target, body, { headers: { ticket } })
    const msg = res.data.msg, newAffair = res.data.affair
    if (msg) await Swal.fire(msg.title, msg.subtitle || '', msg.icon)
    if (res.data.link) window.location.href = res.data.link
    else if (newAffair) {
      for (const k in newAffair) affair[k] = newAffair[k]
    }
  } catch (e) {
    Swal.fire('错误', e.response ? e.response.data : '网络错误', 'error')
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
