<!-- by xsj -->
<template>
  <div class="page">
    <div class="title">
      <h3>日历组件</h3>
      <label>1.0.0</label>
      <span>许赛君</span>
    </div>
    <ul class="menu">
      <li>
        <router-link :to="{ name: 'demo' }">demo</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'api' }">api</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'version' }">version</router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="sass" rel="stylesheet/sass" scoped>
  @import "index.sass"
</style>
