import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';
import store from './store';
import router from './router';
import App from './components/App.vue';

Vue.use(VueRouter);

sync(store, router);

new Vue({ // eslint-disable-line no-new
  el: 'main',
  store,
  router,
  render: h => h(App),
});
