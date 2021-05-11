<template>
  <article class="home">
    <router-link to="/Page">&gt; To Page</router-link>
  </article>
</template>

<script>
import jdy from '../assets/js/jdy'

export default {
  name: 'Home',
  components: {},

  created() {
    this.getPromiseJson()
  },

  methods: {
    getPromiseJson() {
      jdy.post('GetJson', {}, {
        timeout: 6000,
        timeoutLimit: 5,
      }).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })

      setTimeout(() => {
        jdy.cancelAllRequest('cancelMessage')
      }, 3000)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../assets/css/var.styl'

</style>
