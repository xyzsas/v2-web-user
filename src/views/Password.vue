<template>
  <div class="box form">
    <h1 class="title is-spaced">修改密码</h1>

    <div class="pwd-box">
      原密码
      <input class="input is-primary pwd-input" type="password" placeholder="请输入原密码">
    </div>

    <div class="pwd-box">
      新密码
      <input class="input is-primary pwd-input" type="password" placeholder="长度应在8-20位之间，区分大小写" 
      v-model="newpwd">
      <div class="minor-text" :style="{ 'color': textcolor }">
        <p> {{ text }} </p>
      </div>
    </div>

    <div class="pwd-box">
      确认密码
      <input class="input is-primary pwd-input" type="password" placeholder="请再次确认密码">
    </div>

    <button
      class="button is-primary is-rounded is-medium"
      :class="{ 'is-loading': loading }"
    >
      <span class="icon">
        <i class="mdi mdi-24px mdi-arrow-right"></i>
      </span>
    </button>

  </div>
</template>

<script setup>

import { computed } from 'vue'

ref: newpwd = ''

const level = computed(() => {
  let level = 0
  if (newpwd.length < 8) return 0
  if (newpwd.match(/[A-Z]/)) level++
  if (newpwd.match(/[a-z]/)) level++
  if (newpwd.match(/[0-9]/)) level++
  if (newpwd.match(/[!@#$%^&*+-/=?]/)) level++
  if (newpwd.length > 12) level++
  if (level < 3)  return 1
  if (level == 3) return 2
  return 3
})

const text = computed(() => {
  switch(level.value){
    case 0: return '密码长度至少为8'
    case 1: return '密码强度：弱'
    case 2: return '密码强度：中'
    case 3: return '密码强度：强'
  }
})

const textcolor = computed(() => {
  switch(level.value){
    case 0: return 'red'
    case 1: return 'red' 
    case 2: return '#F4D03F'
    case 3: return '#2ECC71'
  }
})
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
.forget-pwd {
  font-size: small; 
}
.pwd-box {
  width: 300px;
  height: 100px;
}
.pwd-input {
  width: 300px;
}
.minor-text {
  color: #616A6B;
  font-size: small; 
}

</style>
