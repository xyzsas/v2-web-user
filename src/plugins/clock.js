import { ref } from 'vue'

export const clock = ref(Date.now())

setInterval(() => { clock.value = Date.now() }, 500)

export const ms2Str = ms => {
  const d = Math.floor(ms/86400e3)
  const h = String(Math.floor(ms/3600e3)%24).padStart(2, '0')
  const m = String(Math.floor(ms/60e3)%60).padStart(2, '0')
  const s = String(Math.floor(ms/1e3)%60).padStart(2, '0')
  return (d ? `${d}天 ` : '') + `${h}:${m}:${s}`
}
