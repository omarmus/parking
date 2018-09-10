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
    modal4: false,
    modal5: false,
    modal6: false,
    modal7: false,
    modal8: false,
    modal9: false,
    action: null,
    selected: null,
    alert: {
      show: false,
      title: 'Alerta',
      text: '',
      callback: null
    },
    form: {},
    clean: false,
    changes: 0,
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
    setChanges (state, value) {
      state.changes = value;
    },
    setAction (state, value) {
      if (value && value.sleep) {
        setTimeout(() => {
          state.action = value.action;
          console.log('Exec action', value.action, 'in', value.sleep);
        }, value.sleep);
      } else {
        state.action = value;
      }
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
    setSelected (state, value) {
      if (Array.isArray(value)) {
        state.selected = value;
      } else {
        if (!state.selected) {
          state.selected = [];
        }
        state.selected.push(value);
      }
    },
    setState403 (state, value) {
      state.state403 = value;
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
      state.modal4 = false;
      state.modal5 = false;
      state.modal6 = false;
      state.modal7 = false;
      state.modal8 = false;
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
