<template>
  <svg viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="100" :fill="color"></circle>
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#f2f3f5',
    }
  },

  data() {
    return {}
  },

  computed: {},

  created() {},

  mounted() {},

  watch: {},

  methods: {},

  components: {}
}
</script>
