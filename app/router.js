import VueRouter from 'vue-router';
import Home from './components/Home.vue';

const routes = [
  { path: '/', component: Home },
];

const router = new VueRouter({ routes });

export default router;
