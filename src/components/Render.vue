<script>
import { compile } from 'vue'
import { A } from '../plugins/state.js'

let flag = true
function onError (e) {
  if (flag) {
    flag = false
    Swal.fire('错误', '事务信息错误', 'error')
      .then(() => { window.location.href = '/' })
  }
  console.error(e)
}

const render = html => html
  .replace(/if="/g, 'v-if="').replace(/for="/g, 'v-for="')
  .replace(/bind:/g, 'v-bind:').replace(/on:/g, 'v-on:')
  .replace(/model="/g, 'v-model="')

export default {
  setup: (props) => {
    const h = compile(render(A.value.content), { onError })
    return (_ctx, _cache) => h(A.value, _cache)
  }
}
</script>