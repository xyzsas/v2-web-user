<template>
  <div class="container">
    <div class="title is-3">{{ greet }}, {{ U.name }}!</div>
    <div class="note mb-3">本页面为XYZSAS v3实验页面</div>
    <div class="title is-5">高四年级第二百零三次选课即将开始 倒计时<code>{{ clock }}</code></div>
    <table class="table">
      <thead>
        <tr>
          <th>课程名称</th>
          <th>剩余量</th>
        </tr>
      </thead>
      <tfoot>
        <tr v-for="c in all" style="cursor: pointer" @click="submit(c)">
          <th>{{ c.name }}</th>
          <th>{{ c.left }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { U, token } from '../plugins/state.js'
import { useRouter } from 'vue-router'
const router = useRouter()

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
let clock = $ref('')

async function getAll() {
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
        Swal.fire('注意', '您已选课, 请勿重复操作!', 'warning')
        selected = data[1].result
      }
    })
    .catch(catchErr)
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

const greet = (() => {
  const h = new Date().getHours()
  if (h < 11) return '早上好'
  if (h >= 11 && h < 13) return '中午好'
  if (h >= 13 && h < 18) return '下午好'
  if (h >= 18) return '晚上好'
})()

async function getClock () {

}

getClock()
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