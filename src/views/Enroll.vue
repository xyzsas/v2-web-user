<template>
  <div class="container">
    <div class="title is-3">社团招新</div>
    <div class="note mb-3">本次社团招新为XYZSAS v3技术实验，请按照指示操作。<strong>请勿反复刷新！</strong></div>
    <div class="note mb-3"><strong>v3系统将不能集体重置密码，此后忘记学生事务系统密码须自行承担延误抢课与查分等功能的风险！</strong></div>
    <div v-if="!shut">
      <div v-if="clock" class="mt-6">
        <h1 class="title is-3" style="text-align: center;">社团招新尚未开始<br><code class="m-2">{{ clock }}</code></h1>
        <p style="text-align: center;">倒计时结束后系统会自动载入数据</p>
      </div>
      <table class="table is-fullwidth m-0" v-if="!pageLoading && !clock && all.length">
        <thead>
          <tr>
            <th>社团名称</th>
            <th style="min-width: 4rem;">剩余</th>
            <th>操作</th>
          </tr>
        </thead>
        <tfoot>
          <tr v-for="(c, i) in all">
            <th>{{ c.name }}</th>
            <th>{{ c.left }}</th>
            <th v-if="i != selected"><button class="button is-small is-info" :disabled="selected || c.left <= 0" :class="{ 'is-loading': loading, 'is-danger': c.left <= 0 }" @click="submit(c, i)">{{ c.left > 0 ? '加入' : '已满' }}</button></th>
            <th v-else><button class="button is-small is-primary" disabled :class="{ 'is-loading': loading }">已加入</button></th>
          </tr>
        </tfoot>
      </table>
      <p v-if="pageLoading">正在加载社团信息, 请耐心等待...</p>
    </div>
    <div v-else><h1 class="title is-3" style="text-align: center;">社团招新已结束</h1></div>
  </div>
</template>

<script setup>
import { U, token } from '../plugins/state.js'
import { useRouter } from 'vue-router'
import axios from '../plugins/axios'
const router = useRouter()
const start = new Date("2021-11-04T12:20:00.000+08:00").getTime()

if (!U.value) router.push('/')

async function catchErr (e, jmp = true) {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  if (jmp) router.push('/experiment')
  return false
}

let all = $ref([])
let selected = $ref(null)
let loading = $ref(false)
let pageLoading = $ref(false)
let clock = $ref('Loading')
let shut = $ref(true)

async function getAll() {
  pageLoading = true
  all = []
  const findModel = { v: 'template', ':': 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyI6IjoiW3tcIiNcIjpcImNsdWJcIixcIl9cIjpcIj9cIn0se1wiI1wiOlwiY2x1YmRhdGFcIixcIl9cIjpcIj9cIixcIjpcIjp7XCIke2lkfVwiOjF9fV0iLCI_IjpbImlkIl0sIm5iZiI6MTYzNTk5OTYwMDAwMH0.VsKedpKnSKRbfGIslUj4SHZYEjK253R7LxSR1cCcUJxcLJIVuRaihTCjYghy8VNRFn6jSIkTfUi3RJa6H6xHhEd_F_V7-staEWHAmFEkUWcOl9xa8w4gUl9JSgz8mrN6e3-FoVsHj8khqet5dNsPJt3gG6ZQ38hg1MiBUbEuDaOGzVrYwDXObl55eTEH9yDglV5Xycy2XIRGKK_8_kaJRj-HMX0XD83HPk6rjnnjsNGEbpd5nJadNf9X0LuYRlGojIwEngZJnrYm2vC08v2tnnJbFY3qP1GoDxgBVO3QrSSH--PKTvG2blCv9WLEIMpcjTBKMG23vymJy4mrE5sddA', s: { id: U.value.id } }
  await axios.post('/xyz', findModel, token())
    .then(({data}) => {
      if (!data[0].ok) Swal.fire('错误', '请重新进入', 'error')
      const cs = data[0].result.options.split(',')
      for (const c of cs) {
        all.push({ name: c.substring(c.indexOf('.') + 2), left: data[0].result['$' + cs.indexOf(c)] })
      }
      if (!data[1].ok) Swal.fire('错误', '请重新进入', 'error')
      if (data[1].result) {
        selected = data[1].result[U.value.id]
      }
    })
    .catch(catchErr)
  pageLoading = false
}

async function submit (c, i) {
  if (selected) return
  loading = true
  let cancel = false
  const submitModel = { v: 'template', ':': 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyI6IjoiW3tcIiNcIjpcImNsdWJkYXRhXCIsXCJfXCI6XCI_XCIsXCIhXCI6MCxcIjpcIjp7XCIke2lkfVwiOjF9fSx7XCIjXCI6XCJjbHViXCIsXCI6XCI6e1wiJCR7aX1cIjp7XCJfXCI6XCJERUNcIn19fSx7XCIjXCI6XCJjbHViZGF0YVwiLFwiOlwiOntcIiR7aWR9XCI6XCIke2l9XCJ9fV0iLCI_IjpbImlkIiwiaSJdLCJuYmYiOjE2MzU5OTk2MDAwMDB9.nqIA_Zd9eFXj1_5GMpyz49-Zr2mMY3up9IpfKukYWez97aM5u09C2QwbY9Ek0m5ghLqIsITzb-Og2IF_qOuyc1uzMMDLnPoFbHkc3LO6E4BcbD7ABqQrLI0fDPDLFnVnaAl1w-QlNl019maoBVzv0bVr44zeq4U-3nDAJ_luanjR7Nuu86OZyJf4kQ7GExoooywpO3rWzwqYj4TSM9vT7NQBT0uQqYTUbzRMTaSH1IrNsKyUToYrKyU3Zt2wp_nYz6x5O0pWVRwqBcG9yIFKV0H5CRZeShRWA9X6hGmfyQ64Y-wElwgvwlDZuMdBVFytPCRz0M8L_9aqNcFKvJe3BQ', s: { id: U.value.id, i: String(i) } }
  await Swal.fire({
    title: '确认加入吗？',
    text: '您即将加入' + c.name,
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
    await axios.post('/xyz', submitModel, token())
    .then(({data}) => {
      getAll()
      if (!data[0].ok) {
        Swal.fire('错误', '请勿重复加入社团!', 'error')
        return
      }
      if (!data[1].ok) {
        Swal.fire('失败', '加入失败, 请查看剩余名额是否充足', 'error')
        return
      }
      if (!data[2].ok) {
        Swal.fire('失败', '系统错误, 请务必联系开发者QQ:1323933782!', 'error')
        return
      }
    })
    .catch(catchErr)
    Swal.fire(`您已加入${c.name}`, '', 'success')
  }
  loading = false
}

let expected = Date.now()
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