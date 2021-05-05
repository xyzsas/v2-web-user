<template>
  <div class="about">
    <img src="/img/logo.svg" style="width: 200px; max-width: 50%;">
    <h1 style="font-size: 4rem;">XYZSAS</h1>
    <p>Powered by yzITI</p>
    <div class="badges m-3">
      <img :src="`https://img.shields.io/badge/version-${version}-brightgreen`">
      <img :src="`https://img.shields.io/badge/user-${user}-blue`">
      <img :src="`https://img.shields.io/badge/admin-${admin}-red`">
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
const version = LS['version'] = '2.1'
const user = LS['web-user-version'] || 'Unavailable'
const admin = LS['web-admin-version'] || 'Unavailable'
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
