import { ref } from 'vue'

export const LS = window.localStorage
export const SS = window.sessionStorage
export const A = ref(null) // affair
export const U = ref(null) // user

let t = ''
export const token = () => ({ headers: { token: t } })
export function setUser ({ user, token }) {
  U.value = user
  t = token
}

if (SS.user && SS.token) setUser({ user: JSON.parse(SS.user), token: SS.token })