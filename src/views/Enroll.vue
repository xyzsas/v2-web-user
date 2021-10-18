<template>
  <div class="container">
    <div class="title is-3">拓展性课程选课</div>
    <div class="note mb-3">本次选课为XYZSAS v3技术实验，请按照指示操作。<strong>请勿反复刷新!</strong></div>
    <div v-if="clock" class="mt-6">
      <h1 class="title is-3" style="text-align: center;">选课尚未开始<br><code class="m-2">{{ clock }}</code></h1>
      <p style="text-align: center;">倒计时结束后系统会自动载入数据</p>
    </div>
    <table class="table is-fullwidth m-0" v-if="!pageLoading && !clock">
      <thead>
        <tr>
          <th>课程名称</th>
          <th style="min-width: 4rem;">剩余</th>
          <th>操作</th>
        </tr>
      </thead>
      <tfoot>
        <tr v-for="c in all">
          <th>{{ c.name }}</th>
          <th>{{ c.left }}</th>
          <th v-if="c.name != selected"><button class="button is-small is-info" :disabled="selected || c.left <= 0" :class="{ 'is-loading': loading, 'is-danger': c.left <= 0 }" @click="submit(c)">{{ c.left > 0 ? '选课' : '已满' }}</button></th>
          <th v-else><button class="button is-small is-primary" disabled :class="{ 'is-loading': loading }">已选</button></th>
        </tr>
      </tfoot>
    </table>
    <p v-if="pageLoading">正在加载选课信息, 请耐心等待...</p>
  </div>
</template>

<script setup>
import { U, token } from '../plugins/state.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const start = Date.now() + 1e4// new Date("2021-10-19T12:00:00.000+08:00").getTime()

async function catchErr (e, jmp = true) {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (jmp) router.push('/experiment')
  return false
}

const url = 'https://sas.aauth.link/xyz'
let all = $ref([])
let selected = $ref(null)
let loading = $ref(false)
let pageLoading = $ref(false)
let clock = $ref('Loading')

async function getAll() {
  pageLoading = true
  const findModel = { v: 'alpha', ':': [{ '#': 'enroll', '_': '?' }, { '#': 'data', '_': '?', ':': { [U.value.id]: 1 } }] }
  await axios.post(url, findModel, token())
    .then(({data}) => {
      if (!data[0].ok) Swal.fire('错误', '非法请求', 'error')
      all = data[0].result.courses.split(',')
      for (let i = 0; i < all.length; i++) {
        all[i] = { name: all[i], left: data[0].result[`$${i}`] }
      }
      if (!data[1].ok) Swal.fire('错误', '非法请求', 'error')
      if (data[1].result) {
        selected = data[1].result[U.value.id]
      }
    })
    .catch(catchErr)
  pageLoading = false
}

async function submit (c) {
  if (selected) return
  loading = true
  let cancel = false
  const submitModel = { v: 'alpha', ':': [{ '#': 'data', '_': '?', '!': 0, ':': { [U.value.id]: 1 } }, { '#': 'enroll', ':': { ['$' + all.indexOf(c)]: { '_': 'DEC' } } }, { '#': 'data', ':': { [U.value.id]: c.name } }] }
  await Swal.fire({
    title: '确认选课吗？',
    text: '您正在选择' + c.name,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then((res) => {
      if (!res.isConfirmed) cancel = true
    })
    .catch(catchErr)
  if (!cancel) {
    await axios.post(url, submitModel, token())
    .then(({data}) => {
      getAll()
      if (!data[0].ok) {
        Swal.fire('错误', '请勿重复选课!', 'error')
        return
      }
      if (!data[1].ok) {
        Swal.fire('失败', '选课失败, 请查看剩余量是否充足', 'error')
        return
      }
      if (!data[2].ok) {
        Swal.fire('失败', '系统错误, 请务必联系开发者QQ:1323933782!', 'error')
        return
      }
      Swal.fire({
        title: '选课成功! ',
        text: '诚邀您填写学生事务系统体验问卷',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: '填写问卷',
        cancelButtonText: '离开'
      })
        .then((res) => { if (res.isConfirmed) router.push('/@/uNhh57K78w') })
        .catch(catchErr)
    })
    .catch(catchErr)
  }
  loading = false
}

let expected = Date.now() + 1000
function step () {
  const curr = Date.now()
  
  const diff = start - curr
  expected += 1000
  if (diff < 0) {
    clock = ''
    getAll()
    return
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0')
  const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
  const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')
  clock = `${days}d ${hours}:${minutes}:${seconds}`
  setTimeout(step, Math.max(0, 1000 - curr + expected))
}
console.log('都说了技术实验版，就不要乱皮了吧！很想皮的话加QQ1323933782，加入ITI吧！')
step()

</script>

<style scoped>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  width: 100%;
  height: 100vh;
  padding: 24px;
}
.note {
  color: grey;
}
</style>