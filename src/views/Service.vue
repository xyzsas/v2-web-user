<template>
  <div style="padding: 20px 4%;">
    <h1 class="title">{{ title }}</h1>
    <p class="subtitle is-6" style="height: 40px;">{{ subtitle }}</p>
    <render v-if="affair" :template="template" :data="data"></render>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Render from '../pieces/Render.vue'
import axios from '../plugins/axios.js'
import { clock } from '../plugins/clock.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(), router = useRouter()

const SS = window.sessionStorage

ref: affair = null
const title = computed(() => affair ? affair.title : '正在载入...')
const subtitle = computed(() => {
  if (!affair) return '请耐心等待，无需反复刷新'
  let res = affair.anonymous ? '匿名事务' : '用户：' + SS.name
  if (affair.end) res += '， 剩余时间：' + Math.floor((affair.end - clock.value)/1000) + '秒'
  return res
})

async function catchErr (e) {
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (!e.response) return
  switch (e.response.status) {
    case 404: return router.push('/')
  }
  fetch()
}

async function fetch () {
  try {
    const res = await axios.get('/service?id=' + route.params.id, { headers: { token: SS.token } })
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
    console.log(a)
  } catch (e) {
    await catchErr(e)
  }
}
fetch()

ref: data = { cot: 1 }
const template = '<h1 class="title" @click="data.cot++">{{ data.cot }}</h1><test></test>'
</script>