'use strict';

import Vuex from 'vuex';
import Vue from 'vue';

import layout from './modules/layout';
import usuario from './modules/usuario';

import modal from '@/common/plugins/modal/mixins/modal';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    main: true,
    time: null,
    sessionInterval: null,
    auth: false,
    menu: {},
    user: {},
    date: {},
    permissions: {},
    rol: '',
    sidenav: false,
    state403: false,
    modal: false,
    modal2: false,
    modal3: false,
    action: null,
    alert: {
      show: false,
      text: '',
      callback: null
    },
    form: {},
    clean: false,
    confirm: {
      show: false,
      text: '',
      callbackOk: null,
      callbackCancel: null,
      textOk: '',
      textCancel: ''
    }
  },
  mutations: {
    setMain (state, value) {
      state.main = value;
    },
    setUser (state, value) {
      state.user = value;
    },
    setMenu (state, value) {
      state.menu = value;
    },
    setAuth (state, value) {
      state.auth = value;
    },
    setSidenav (state, value) {
      state.sidenav = value;
    },
    setPermissions (state, value) {
      state.permissions = value;
    },
    setForm (state, value) {
      state.form = value;
    },
    setAction (state, value) {
      state.action = value;
    },
    cleanDate (state, value) {
      state.clean = value;
    },
    openModal (state, id = '') {
      state[`modal${id}`] = true;
    },
    closeModal (state, id = '') {
      state[`modal${id}`] = false;
    },
    setDate (state, value) {
      if (state.date === undefined) {
        state.date = {};
      }
      if (value) {
        const keys = Object.keys(value);
        if (keys.length) {
          state.date[keys[0]] = value[keys[0]];
        } else {
          state.date = value;
        }
      } else {
        state.date = value;
      }
    },
    setDefault (state) {
      state.auth = false;
      state.menu = {};
      state.user = {};
      state.date = {};
      state.permissions = {};
      state.rol = '';
      state.layout.breadcrumbs = {};
      state.modal = false;
      state.modal2 = false;
      state.modal3 = false;
      state.state403 = false;
      state.alert.show = false;
      state.confirm.show = false;
      document.removeEventListener('keydown', modal.methods.bloquear, false);
    },
    CLOSE_ALERT (state) {
      state.alert.show = false;
      document.removeEventListener('keydown', modal.methods.bloquear, false);
    },
    CLOSE_CONFIRM (state) {
      state.confirm.show = false;
      document.removeEventListener('keydown', modal.methods.bloquear, false);
    },
    SET_TIME (state, value) {
      state.time = value;
    },
    TIME_DECREASE (state) {
      state.time -= 15;
    },
    DESTROY_INTERVAL (state) {
      if (state.sessionInterval) {
        window.clearInterval(state.sessionInterval);
      }
      state.sessionInterval = null;
    },
    INIT_INTERVAL (state, interval) {
      state.sessionInterval = interval;
    }
  },
  modules: {
    layout,
    usuario
  }
});
