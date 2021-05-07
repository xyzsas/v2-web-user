<template>
  <div class="login box">
    <div class="box form">
      <h1 class="title is-spaced">学生事务系统</h1>
      <p class="subtitle">登录</p>
      <transition name="fade" mode="out-in">
        <div v-if="step === 'username'">
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
            :disabled="!username"
            :class="{ 'is-loading': loading }"
            @click="confirmUsername"
          >
            <span class="icon">
              <i class="mdi mdi-24px mdi-arrow-right"></i>
            </span>
          </button>
        </div>

        <div v-else>
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
            :disabled="!password"
            :class="{ 'is-loading': loading }"
            @click="confirmPassword"
          >
            <span class="icon">
              <i class="mdi mdi-24px mdi-check"></i>
            </span>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, nextTick } from 'vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
import axios from '../plugins/axios'
import { md5, sha256 } from '../plugins/convention'
import { U, SS, setUser } from '../plugins/state.js'

ref: step = 'username'

const msg = reactive({
  text: '',
  err: false,
  color: computed(() => msg.text ? (msg.err ? '#f5222d' : '#00c4a7') : '#fff')
})
const clearMsg = () => {
  msg.text = ''
  msg.err = false
}

ref: loading = false

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
    const res = await axios.get('/auth/' + id)
    random = res.data
  } catch {
    msg.text = '网络错误，请稍后重试'
    msg.err = true
    return
  }
  await new Promise((resolve) => setTimeout(resolve, 1000))
  step = 'password'
  clearMsg()
  loading = false
  await new Promise((resolve) => setTimeout(resolve, 1000))
  input.focus()
}

const confirmPassword = async () => {
  loading = true
  try {
    const url = route.query.c
    msg.text = '正在验证您的身份...'
    msg.err = false
    const { data } = await axios.post('/auth/' + (url == 'AAUTH' ? 'code' : 'user'), {
      random,
      password: sha256(sha256(password) + random)
    })
    msg.text = '登录成功，正在跳转...'
    msg.err = false
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (url === 'AAUTH') {
      window.location.href = 'https://cn.aauth.link/reenter.html?code=' + data + '&state=' + (route.query.state || '')
      return
    }
    setUser(data)
    SS.user = JSON.stringify(data.user)
    SS.token = data.token
    if (url) window.location.href = url
    else router.push('/')
  } catch (err) {
    console.log(err)
    msg.text = '网络错误'
    msg.err = true
    if (err.response) msg.text = err.response.data
    await new Promise((resolve) => setTimeout(resolve, 1000))
    step = 'username'
    clearMsg()
    username = password = ''
    loading = false
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

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
p.message {
  background: #fff;
  padding-left: 8px;
  text-align: left;
  font-size: 0.8em;
  height: 0.8em;
  transition: all 0.5s ease;
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