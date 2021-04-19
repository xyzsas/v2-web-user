<script>
import { compile } from 'vue'

const LS = window.localStorage
import Piece from './Piece.vue'

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
  props: ['template', 'data', 'vars', 'ticket'],
  components: {
    Piece
  },
  setup: (props) => {
    if (LS.developer) console.log(props.template)
    const h = compile(render(props.template), { onError })
    return (_ctx, _cache) => h(props, _cache)
  }
}
</script>