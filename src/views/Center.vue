<!-- Page for user center
1. 修改信息
2. 引导用户上传图片（1寸照片大小）
3. 绑定QQ -->
<template>
  <div class="container content" v-if="SS.token">
    <h1>个人中心</h1>
    <p>用户组：<code>{{ SS.group }}</code></p>
    <figure style="width: 160px; height: 240px; padding: 0px; margin: 5px 0px 5px 0px; border: 3px #efefef solid">
      <img :src="img" alt="个人照片" width="160" height="240">
    </figure>
    <div>
      <tr class="control" v-for="(v, k) in data">
        <td>
          <p>{{ map[k] }}</p>
        </td>
        <td>
          <input v-model="data[k]" class="input" type="text" :placeholder="v" style="max-width: 400px">
        </td>
      </tr>
    </div>
    <button class="button is-primary" @click="submit">
      <span>提交修改</span>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import axios from '../plugins/axios'

const router = useRouter()
const SS = window.sessionStorage
const location = window.location
const map = {
  name: '姓名：',
  id: '身份证号：',
  address: '家庭住址：',
  father: '父亲姓名：',
  mother: '母亲姓名：',
  phone: '电话号码：'
}

ref: msg = []
ref: loading = true
ref: img = ''
ref: data = {
  name: 'abc',
  id: '1234345',
  address: '12xwd',
  father: 'fff',
  mother: 'mmm',
  phone: '222'
}

// if (!SS.token) router.push('/login')
// else axios // get messages
//   .get('/msg', { headers: { token: SS.token } })
//   .then(({ data }) => {
//     loading = false
//     msg = data.map(x => x.split('$$'))
//   })
//   .catch(err => {
//     Swal.fire({
//       text: err.response ? err.response.data : '网络错误',
//       icon: 'error',
//       willClose: () => { router.push('/login') }
//     })
//   })

const submit = (() => {
  console.log('submit')
})
</script>

<style scoped>
div.container {
  width: 100%;
  max-width: 500px;
  height: 100vh;
  padding: 24px;
}
td {
  vertical-align: middle;
  height: 50px;
}
</style>