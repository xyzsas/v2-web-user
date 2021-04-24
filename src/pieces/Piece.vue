<template>
  <h1 class="title">{{ piece.T }} <code>{{ id }}</code></h1>
</template>

<script setup>
import { defineProps } from 'vue'
import { A } from '../plugins/state.js'
const props = defineProps(['id'])
const id = props.id
ref: piece = A.value.pieces[id]
</script>
