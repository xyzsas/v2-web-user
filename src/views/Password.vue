<template>
  <div class="box form">
    <h1 class="title is-spaced">修改密码</h1>
    <p class="submit" v-if="route.query.id">首次设置密码</p>

    <div class="pwd-box" v-show="!route.query.id">
      原密码
      <input class="input is-primary pwd-input" type="password" placeholder="请输入原密码" v-model="oldpwd">
    </div>

    <div class="pwd-box">
      新密码
      <input class="input is-primary pwd-input" type="password" placeholder="请输入新密码" v-model="newpwd">
      <div class="minor-text" :style="{ 'color': textcolor }">
        <p> {{ text }} </p>
      </div>
    </div>

    <div class="pwd-box">
      确认密码
      <input class="input is-primary pwd-input" type="password" placeholder="请再次确认密码" v-model="repeat">
      <div class="minor-text" style="color: #f5222d; height: 20px;">
        <p v-if="repeat && repeat != newpwd">确认密码不正确</p>
      </div>
    </div>

    <button
      class="button is-primary is-rounded is-medium"
      :class="{ 'is-loading': loading }"
      :disabled="!oldpwd || newpwd.length < 8 || repeat != newpwd"
      @click="submit"
    >
      <span class="icon">
        <i class="mdi mdi-24px mdi-check"></i>
      </span>
    </button>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import axios from '../plugins/axios.js'
import { sha256 } from '../plugins/convention.js'
import { SS } from '../plugins/state.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

ref: newpwd = ''
ref: oldpwd = ''
ref: repeat = ''
ref: loading = false

if (route.query.id) {
  SS.id = route.query.id
  oldpwd = 'XYZSAS'
} else if (!SS.id) router.push('/')

const level = computed(() => {
  let level = 0
  if (newpwd.length < 8) return 0
  if (newpwd.match(/[A-Z]/)) level++
  if (newpwd.match(/[a-z]/)) level++
  if (newpwd.match(/[0-9]/)) level++
  if (newpwd.match(/[!@#$%^&*+-/=?]/)) level++
  if (newpwd.length > 12) level++
  if (level < 2) return 1
  if (level > 3) return 3
  return 2
})

const text = computed(() => {
  switch (level.value) {
    case 0: return '密码长度至少为8'
    case 1: return '密码强度：弱'
    case 2: return '密码强度：中'
    case 3: return '密码强度：强'
  }
})

const textcolor = computed(() => {
  switch (level.value) {
    case 0: return '#f5222d'
    case 1: return '#f5222d' 
    case 2: return '#F4D03F'
    case 3: return '#00c4a7'
  }
})

const catchErr = e => {
  Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  return false
}

async function submit () {
  if (!oldpwd || !newpwd || repeat != newpwd) return
  loading = true
  const random = await axios.get('/auth/' + SS.id)
    .then(({ data }) => data)
    .catch(catchErr)
  if (!random) return
  await axios.put('/auth/', {
    random,
    password: sha256(sha256(oldpwd) + random),
    newPassword: sha256(newpwd)
  })
    .then(async () => {
      delete SS.id
      delete SS.token
      await Swal.fire('修改密码成功', '请重新登录', 'success')
      router.push('/')
    })
    .catch(catchErr)
  loading = false
}
</script>


<style>
.form {
  height: 100vh;
  padding:150px 100px;
  margin-bottom: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pwd-box {
  width: 300px;
  margin: 10px;
}
.pwd-input {
  width: 300px;
}
.minor-text {
  color: #616A6B;
  font-size: small; 
}

</style>
