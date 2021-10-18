<template>
  <div class="container">
    <div class="title is-3">拓展性课程选课</div>
    <div class="note mb-3">本页面为XYZSAS v3实验页面</div>
    <div class="title is-5">倒计时<code>{{ clock }}</code></div>
    <table class="table" v-if="!pageLoading">
      <thead>
        <tr>
          <th>课程名称</th>
          <th>剩余量</th>
          <th>选择</th>
        </tr>
      </thead>
      <tfoot>
        <tr v-for="c in all" style="cursor: pointer" @click="submit(c)">
          <th>{{ c.name }}</th>
          <th>{{ c.left }}</th>
          <th><button class="button is-small is-info" :disabled="selected">选课</button></th>
        </tr>
      </tfoot>
    </table>
    <p v-else>正在加载选课信息...</p>
  </div>
</template>

<script setup>
import { U, token } from '../plugins/state.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const start = new Date("2021-10-20T12:00:00.000+08:00").getTime()

async function catchErr (e, jmp = true) {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (jmp) router.push('/')
  return false
}

const url = 'https://sas.aauth.link/xyz'
let all = $ref([])
let selected = $ref(null)
let loading = $ref(false)
let pageLoading = $ref(false)
let clock = $ref('')

async function getAll() {
  pageLoading = true
  const findModel = { v: 'alpha', ':': [{ '#': 'enroll', '_': '?' }, { '#': 'data', '_': '?', ':': { [U.value.id]: 1 } }] }
  await axios.post(url, findModel, token())
    .then(({data}) => {
      if (!data[0].ok) Swal.fire('错误', '非法请求', 'error')
      console.log(data)
      all = data[0].result.courses.split(',')
      for (let i = 0; i < all.length; i++) {
        all[i] = { name: all[i], left: data[0].result[`$${i}`] }
      }
      if (!data[1].ok) Swal.fire('错误', '非法请求', 'error')
      if (data[1].result) {
        Swal.fire('注意', '您已选课, 请勿重复操作!', 'warning')
        selected = data[1]
      }
    })
    .catch(catchErr)
  pageLoading = false
}

async function submit (c) {
  if (selected) return
  loading = true
  const submitModel = { v: 'alpha', ':': [{ '#': 'data', '_': '?', '!': 0, ':': { [U.value.id]: 1 } }, { '#': 'enroll', ':': { ['$' + all.indexOf(c)]: { '_': 'DEC' } } }, { '#': 'data', ':': { [U.value.id]: c.name } }] }
  await axios.post(url, submitModel, token())
    .then(({data}) => {
      if (data[0].ok && data[1].ok) {
        Swal.fire('成功', '选课成功', 'success')
          .then(() => { router.push('/@/uNhh57K78w') })
          .catch(catchErr)
      }
    })
    .catch(catchErr)
  loading = false
}

let expected = Date.now() + 1000
function step () {
  const curr = Date.now()
  
  const diff = start - curr
  expected += 1000
  if (diff < 0) {
    clock = '结束'
    return
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  clock = days + "d " + hours + "h " + minutes + "m " + seconds + "s "
  setTimeout(step, Math.max(0, 1000 - curr + expected))
}

step()
getAll()

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
th {
  width: 50vw;
}
</style>