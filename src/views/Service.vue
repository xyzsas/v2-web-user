<template>
  <div class="service">
    <div class="box" style="max-width: 700px; width: 100%;">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle is-6" style="margin-bottom: 0;">{{ subtitle }}</p>
      <hr v-if="affair" class="mt-2">
      <render v-if="affair" :template="affair.content" :data="affair.data"></render>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Render from '../pieces/Render.vue'
import axios from '../plugins/axios.js'
import { clock, ms2Str } from '../plugins/clock.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(), router = useRouter()

const SS = window.sessionStorage

ref: affair = null
const title = computed(() => affair ? affair.title : '正在载入...')
const subtitle = computed(() => {
  if (!affair) return '请耐心等待，无需反复刷新'
  let res = affair.anonymous ? '匿名事务' : '用户：' + SS.name
  if (affair.end) res += '， 剩余时间：' + ms2Str(affair.end - clock.value)
  return res
})

async function catchErr (e) {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!e.response) return
  switch (e.response.status) {
    case 404: {
      if (SS.token) router.push('/')
      else router.push('/login?c=' + encodeURIComponent('/#/@/' + route.params.id))
      return
    }
  }
  fetch()
}

async function fetch () {
  try {
    const res = await axios.get('/service/' + route.params.id, { headers: { token: SS.token } })
    const a = res.data
    a.variables = {}
    for (const k in a) {
      if (k.indexOf('V:') === 0) {
        a.variables[k.substr(2)] = a[k]
        delete a[k]
      }
    }
    if (a.duration) a.end = a.duration + Date.now()
    delete a.duration
    affair = a
  } catch (e) {
    await catchErr(e)
  }
}
fetch()
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
</style>
