<script>
import { compile } from 'vue'

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

export default {
  props: ['template', 'data', 'vars', 'ticket'],
  components: {
    Piece
  },
  setup: (props) => {
    const h = compile(props.template, { onError })
    return (_ctx, _cache) => h(props, _cache)
  }
}
</script>