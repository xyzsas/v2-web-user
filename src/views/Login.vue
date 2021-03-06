<template>
  <div class="login box">
    <div class="box form">
      <h1 class="title" style="margin-bottom: 16px">学生事务系统</h1>
      <p class="tip">登录</p>
      <div
        :style="{ opacity: formVisible ? '1' : '0' }"
        style="transition: all 0.5s ease"
        v-show="step === 'username'"
      >
        <div class="control has-icons-left" style="margin-bottom: 24px">
          <input
            class="input is-primary is-medium"
            style="width: 280px"
            type="text"
            placeholder="用户名"
            v-model="username"
            @keyup.enter="confirmUsername"
          />
          <span class="icon is-left">
            <i class="mdi mdi-24px mdi-account-circle"></i>
          </span>
          <p class="message" :style="{ 'color': msg.color }">{{ msg.text }}</p>
        </div>

        <button
          class="button is-primary is-rounded is-medium"
          :class="{ 'is-loading': loading }"
          @click="confirmUsername"
        >
          <i class="mdi mdi-24px mdi-arrow-right"></i>
        </button>
      </div>

      <div
        :style="{ opacity: formVisible ? '1' : '0' }"
        style="transition: all 0.5s ease"
        v-show="step === 'password'"
      >
        <div class="control has-icons-left" style="margin-bottom: 24px">
          <input
            class="input is-primary is-medium"
            style="width: 280px"
            type="password"
            placeholder="密码"
            v-model="password"
            @keyup.enter="confirmPassword"
            ref="input"
          />
          <span class="icon is-left">
            <i class="mdi mdi-24px mdi-key"></i>
          </span>
          <p class="message" :style="{ 'color': msg.color }">{{ msg.text }}</p>
        </div>

        <button
          class="button is-primary is-rounded is-medium"
          :class="{ 'is-loading': loading }"
          @click="confirmPassword"
        >
          <i class="mdi mdi-24px mdi-check"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, nextTick } from 'vue'
import Hashes from 'jshashes'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import axios from '../plugins/axios'

const md5 = (msg) => new Hashes.MD5().b64(msg).substr(7, 10).replace(/\//g, '_').replace(/\+/g, '-')
const sha256 = (msg) => new Hashes.SHA256().b64(msg + 'XYZSAS_STATIC_SALT')

ref: step = 'username'

const msg = reactive({
  text: '',
  err: false,
  color: computed(() => msg.err ? '#f5222d' : '#00c4a7')
})
const clearMsg = () => {
  msg.text = ''
  msg.err = false
}

ref: loading = false
ref: formVisible = true

ref: username = ''
ref: password = ''
ref: random = ''

watch($username, clearMsg)
watch($password, clearMsg)

ref: input = null

const confirmUsername = async () => {
  username = username.toUpperCase()
  await nextTick()
  loading = true
  msg.err = false
  msg.text = '安全检查中，请耐心等待'
  const id = md5(username)
  try {
    const res = await axios.get('/auth?id=' + id)
    random = res.data
  } catch {
    msg.text = '网络错误，请稍后重试'
    msg.err = true
    return
  }
  formVisible = false
  await new Promise((resolve) => setTimeout(resolve, 1000))
  step = 'password'
  clearMsg()
  loading = false
  formVisible = true
  await nextTick()
  input.focus()
}

const confirmPassword = async () => {
  loading = true
  
  try {
    msg.text = '正在验证您的身份...'
    msg.err = false
    const { data } = await axios.post('/auth', {
      random,
      password: sha256(sha256(password) + random)
    })
    const SS = window.sessionStorage
    SS.token = data.token
    SS.name = data.user.name
    SS.id = data.user.id
    SS.group = data.user.group
    SS.role = data.user.role

    msg.text = '登录成功，正在跳转...'
    msg.err = false
    await new Promise((resolve) => setTimeout(resolve, 1000))
    let url = route.query.c
    if (route.query.c === 'AAUTH') {
      url = 'https://aauth.link/reenter.html?code=' + data.code + '&state=' + route.query.state
    }
    if (url) window.location.href = url
    else router.push('/')
  } catch (err) {
    msg.text = '网络错误'
    msg.err = true
    if (err.response) msg.text = err.response.data
  }
  
}
</script>

<style scoped>
div.login {
  color: #333;
  background: #f2f2f2;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
p.tip {
  position: relative;
  font-size: 1.2em;
  font-weight: bold;
  width: 100%;
  color: #555;
  margin: 10px 0 20px;
}
p.message {
  background: #fff;
  padding-left: 8px;
  text-align: left;
  font-size: 0.8em;
  height: 0.8em;
}
.form {
  height: 310px;
  padding: 36px 100px;
  margin-bottom: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 500px) {
  .form {
    width: 100%;
    padding: 30px 10px;
  }
}
</style>