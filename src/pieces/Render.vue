<script>
import { compile } from 'vue'
console.warn = e => {
  const str = e.toString()
  if (str == '[Vue warn]: Property undefined was accessed during render but is not defined on instance.') return
  console.error(e)
  Swal.fire('系统错误', '', 'error')
}

import Test from './Test.vue'

export default {
  props: ['template', 'data', 'variables', 'ticket'],
  components: {
    Test
  },
  setup: (props) => compile(props.template)
}
</script>