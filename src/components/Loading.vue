<template>
  <div class="loading">
    <slot></slot>
    <img src="/img/logo.svg" style="width: 30px; margin-left: 20px;">
  </div>
</template>

<style scoped>
div.loading {
  opacity: 0.7;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>