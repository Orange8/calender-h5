import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: resolve => { require(['../views/index/index.vue'], resolve) },
      meta: { title: '日历组件-许赛君' }
    },
    {
      path: '/demo',
      name: 'demo',
      component: resolve => { require(['../views/demo/demo.vue'], resolve) },
      meta: { title: 'demo' }
    },
    {
      path: '/api',
      name: 'api',
      component: resolve => { require(['../views/api/api.vue'], resolve) },
      meta: { title: 'api' }
    },
    {
      path: '/version',
      name: 'version',
      component: resolve => { require(['../views/version/version.vue'], resolve) },
      meta: { title: 'version' }
    }
  ]
})
