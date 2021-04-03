import { ref } from 'vue'

export const clock = ref(Date.now())

setInterval(() => { clock.value = Date.now() }, 500)
