import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import modules from './modules';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  getters,
  actions,
  mutations,
  modules,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
