<template>
  <div>
    <transition :name="transitionName">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        transitionName: 'fade'
      }
    },
    components: {},
    watch: {
      $route (to, from) {
        document.title = this.$route.meta.title;
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/sass">
  @import 'assets/sass/common/app.sass';
</style>
