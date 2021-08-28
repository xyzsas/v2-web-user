<template>
  <div v-if="sentence && sentence.hitokoto" class="ml-6" style="opacity: 0.7; font-size: 0.8rem; max-width: 60vw;">
    <p>{{ sentence.hitokoto }}</p>
    <p style="text-align: right;">
      —— {{ sentence.from_who || '' }}「{{ sentence.from }}」
    </p>
  </div>
</template>

<script setup>
let sentence = $ref(null)
axios.get('https://v1.hitokoto.cn/?c=d&c=h&c=i&c=k')
  .then(res => { sentence = res.data })
  .catch(() => {})
</script>