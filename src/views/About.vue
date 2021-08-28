<template>
  <div class="about">
    <img src="/img/logo.svg" style="width: 200px; max-width: 50%;" @click="icon">
    <h1 style="font-size: 4rem;">XYZSAS</h1>
    <p style="cursor: pointer;" @click="ITI">Powered by yzITI</p>
    <div class="badges m-3">
      <img :src="`https://img.shields.io/badge/user-UTC ${user}-blue`">
      <img :src="`https://img.shields.io/badge/admin-UTC ${admin}-red`">
    </div>
    <div style="height: 10vh;"></div>
    <div class="footer">
      <a href="https://github.com/xyzsas">
        <i class="mdi mdi-github"></i>&nbsp;Github
      </a>
    </div>
  </div>
</template>

<script setup>
import { LS } from '../plugins/state.js'
const user = (LS['web-user-version'] || 'Unavailable').replace(/-/g, '--')
const admin = (LS['web-admin-version'] || 'Unavailable').replace(/-/g, '--')

function ITI () {
  window.location.href = 'https://dev.yzzx.org/ITI/'
}

let x = 0
function icon () {
  x++
  setTimeout(() => { x-- }, 1000)
  if (x == 5) {
    window.localStorage.developer = 1
    Swal.fire('启用开发者模式', 'window.localStorage.developer', 'success')
  }
}
</script>

<style scoped>
div.about {
  position: relative;
  text-align: center;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
div.footer {
  position: absolute;
  display: flex;
  padding: 0;
  bottom: 4px;
}
div.badges * {
  margin: 8px;
}
a {
  color: black;
  text-decoration: none;
}
</style>
