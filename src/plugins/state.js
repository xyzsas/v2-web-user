import { ref } from 'vue'

export const LS = window.localStorage
export const SS = window.sessionStorage
export const A = ref(null) // affair

export const token = () => ({ headers: { token: SS.token } })