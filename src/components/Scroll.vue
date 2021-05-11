<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: null,
    },
    pullup: {
      type: Boolean,
      default: false,
    },
    beforeScroll: {
      type: Boolean,
      default: false,
    },
    refreshDelay: {
      type: Number,
      default: 20,
    },
  },
  mounted() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
      })

      if (this.listenScroll) {
        const me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }

      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }

      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable() {
      if (this.scroll) {
        this.scroll.disable()
      }
    },
    enable() {
      if (this.scroll) {
        this.scroll.enable()
      }
    },
    refresh() {
      if (this.scroll) {
        this.scroll.refresh()
      }
    },
    scrollTo(...args) {
      if (this.scroll) {
        this.scroll.scrollTo(...args)
      }
    },
    scrollToElement(...args) {
      if (this.scroll) {
        this.scroll.scrollToElement(...args)
      }
    },
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    },
  },
}
</script>
